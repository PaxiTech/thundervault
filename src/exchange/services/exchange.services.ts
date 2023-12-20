import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Errors } from '@src/common/contracts/error';
import { PaginateDto } from '@src/common/dtos/paginate.dto';
import { AppException } from '@src/common/exceptions/app.exception';
import { presaleConfig } from '@src/exchange/contracts/exchange-config';
import { CommonConfigItem, ExchangeListItem } from '@src/exchange/dtos/exchange-response.dto';
import { ExchangeResultDto, FilterExchangeListDto } from '@src/exchange/dtos/list.dto';
import { ExchangeRepository } from '@src/exchange/repositories/exchange.repository';
import { ExchangeDocument } from '@src/exchange/schemas/exchange.schema';
import { UtilHelperService } from '@src/utils/helper.service';
import { get as _get, isEmpty as _isEmpty, sumBy as _sumBy } from 'lodash';
import * as moment from 'moment-timezone';
import { IExchange } from '../interfaces/exchange.interface';
import { ExchangeAddManualDto } from '@src/exchange/dtos/buy.dto';
import { UserService } from '@src/user/services/user.services';

@Injectable()
export class ExchangeService {
  constructor(
    private exchangeRepository: ExchangeRepository,
    private configService: ConfigService,
    private helperService: UtilHelperService,
    private userService: UserService,
  ) {}

  public async getTotalHasBeenSale(roundId: string): Promise<number> {
    const total = await this.exchangeRepository.getTotalHasBeenSale(roundId);
    return total;
  }

  /**
   *
   * @param paginationParam
   * @returns
   */
  async getExchangeHistory(
    wallet: string,
    filterExchangeListDto: FilterExchangeListDto,
    paginationParam: PaginateDto,
  ): Promise<any> {
    const roundId = filterExchangeListDto.roundId ?? this.configService.get<string>('presaleId');
    const conditions = {
      wallet: wallet,
      roundId: roundId,
    };
    const exchangeList = await this.exchangeRepository.pagination({
      conditions: conditions,
      ...paginationParam,
    });
    const { docs = [], ...pagination } = exchangeList;
    const result = new ExchangeListItem();
    const list = docs.map((item) => {
      return this.populateExchangeInfo(item);
    });

    result.docs = list;
    return { ...result, ...pagination };
  }

  public getCurrentPreSale() {
    const currentId = this.configService.get<string>('presaleId');
    const currentPreSale: any =
      presaleConfig.find((item) => {
        return item.id === currentId;
      }) ?? {};
    if (_isEmpty(currentPreSale)) {
      return currentPreSale;
    }
    const currentTime = this.helperService.getCurrentTime();
    const startTime = moment(currentPreSale.startTime).format('YYYY-MM-DD HH:mm:ss');
    const endTime = moment(currentPreSale.endTime).format('YYYY-MM-DD HH:mm:ss');
    if (currentTime >= startTime && currentTime <= endTime) {
      return currentPreSale;
    }
    return {};
  }

  public async getCurrentPreSaleInfo(): Promise<any> {
    const currentPreSale = this.getCurrentPreSale();
    if (!currentPreSale) {
      return currentPreSale;
    }
    const totalSaled = await this.exchangeRepository.getTotalHasBeenSale(currentPreSale.id);
    const totalUser = await this.exchangeRepository.getTotalUsers(currentPreSale.id);
    const totalTimesSaled = await this.exchangeRepository.count({
      roundId: currentPreSale.id,
    });
    return {
      ...currentPreSale,
      isEnd:
        currentPreSale.endTime < this.helperService.getCurrentTime() ||
        totalSaled >= currentPreSale.maxTicket,
      serverTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      saledInfo: {
        totalTicket: totalSaled,
        totalToken: totalSaled * currentPreSale.amountForOneTicket,
        totalUser: totalUser,
        totalTimesSale: totalTimesSaled,
      },
    };
  }

  /**
   * populateExchangeInfo
   * @param exchange {ExchangeDocument}
   * @returns
   */
  public populateExchangeInfo(exchange: ExchangeDocument) {
    const data = {
      _id: _get(exchange, '_id'),
      roundId: exchange.roundId,
      wallet: exchange.wallet,
      transactionHash: exchange?.transactionHash,
      ownerWallet: exchange?.ownerWallet,
      amount: exchange?.amount,
      price: exchange?.price,
      ticketPrice: exchange?.ticketPrice,
      amountForOneTicket: exchange?.amountForOneTicket,
      exchangeType: exchange?.exchangeType,
      amountToken: exchange?.amountToken,
      amountTicket: exchange?.amountTicket,
      preRefAmount: exchange?.preRefAmount,
      preRefWallet: exchange?.preRefWallet,
      createTime: exchange?.createTime,
      createdAt: _get(exchange, 'createdAt'),
      updatedAt: _get(exchange, 'updatedAt'),
    };
    return data;
  }

  public async getCommonConfig(): Promise<CommonConfigItem> {
    const ownerWallet = this.configService.get<string>('ownerWallet');
    if (_isEmpty(ownerWallet)) {
      const { code, message, status } = Errors.OWNER_WALLET_NOT_FOUND;
      throw new AppException(code, message, status);
    }
    const data: CommonConfigItem = {
      ownerWallet: ownerWallet,
    };
    return data;
  }

  public async createExchange(createData: IExchange): Promise<any> {
    const exchangeEntity = await this.exchangeRepository.create(createData);
    const exchangeInfo = this.populateExchangeInfo(exchangeEntity);
    return exchangeInfo;
  }

  public async addManual(exchangeAddManualDto: ExchangeAddManualDto) {
    const { from, to, amount, transactionHash, secretKey } = exchangeAddManualDto;
    const configSecretKey = this.configService.get<string>('configSecretKey');
    if (secretKey != configSecretKey) {
      const { code, message, status } = Errors.INVALID_SECRET_KEY;
      throw new AppException(code, message, status);
    }

    //update or insert user
    this.userService.upsertUser(from);
    //get current presave
    const currentPreSale = this.getCurrentPreSale();
    //create exchange
    let createData: IExchange = {
      wallet: from,
      transactionHash: transactionHash,
      ownerWallet: to,
      amount: amount,
      roundId: currentPreSale?.id,
      price: currentPreSale?.price,
      ticketPrice: currentPreSale?.ticketPrice,
      amountForOneTicket: currentPreSale?.amountForOneTicket,
      exchangeType: currentPreSale?.exchangeType,
      amountToken: currentPreSale?.amountForOneTicket,
      amountTicket: 1,
      createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
    //process for presale ref
    if (currentPreSale?.isPreRef) {
      const preRefUser = await this.userService.getUserInfoByPreRefCode(from);
      if (preRefUser) {
        createData = {
          ...createData,
          preRefAmount: currentPreSale?.preRefAmount,
          preRefWallet: preRefUser.wallet,
        };
      }
    }
    return this.createExchange(createData);
  }

  /**
   *
   * @param paginationParam
   * @returns
   */
  async getResult(
    filterExchangeListDto: ExchangeResultDto,
    paginationParam: PaginateDto,
  ): Promise<any> {
    const roundId = filterExchangeListDto.roundId ?? this.configService.get<string>('presaleId');
    const conditions = {
      roundId: roundId,
    };
    const exchangeList = await this.exchangeRepository.pagination({
      conditions: conditions,
      ...paginationParam,
    });
    const { docs = [], ...pagination } = exchangeList;
    const result = new ExchangeListItem();
    const list = docs.map((item) => {
      return this.populateExchangeInfo(item);
    });

    result.docs = list;
    return { ...result, ...pagination };
  }

  //ref pre sale
  /**
   *
   * @param paginationParam
   * @returns
   */
  async getPresaleRefListByUser(preRefWallet: string, roundId: string): Promise<any> {
    //const roundId = this.configService.get<string>('presaleId');
    const conditions = {
      preRefWallet: preRefWallet,
      roundId: roundId,
    };
    const exchangeList = await this.exchangeRepository.find({
      conditions: conditions,
    });
    const result = exchangeList.map((item) => {
      return this.populateExchangeInfo(item);
    });

    return result;
  }
  public getLastPreSale(): Array<any> {
    const currentTime = this.helperService.getCurrentTime();
    const lastPresale: any = presaleConfig.filter((item) => {
      const startTime = moment(item.startTime).format('YYYY-MM-DD HH:mm:ss');
      if (currentTime >= startTime) {
        return item;
      }
    });

    return lastPresale;
  }
  //list kê các thông tin của user.
  async getSummaryByUser(wallet: string, option: any): Promise<any> {
    const roundList = this.getLastPreSale();
    if (roundList.length == 0) {
      return {};
    }
    const result = [];
    for (let i = 0; i < roundList.length; i++) {
      const roundId = roundList[i].id;
      const conditions = {
        wallet: wallet,
        roundId: roundId,
      };
      const exchangeList = await this.exchangeRepository.find({
        conditions: conditions,
      });
      const ticket = exchangeList.length;
      if (roundList[i]?.isPreRef && !_isEmpty(option?.preRefCode)) {
        const preRefExchangeInfo = await this.getPresaleRefListByUser(wallet, roundId);
        // method
        if (!_isEmpty(preRefExchangeInfo)) {
          const totalPreRefAmount = _sumBy(preRefExchangeInfo, function (e) {
            return e.preRefAmount;
          });
          result[roundId] = {
            ticket: ticket,
            historyList: exchangeList,
            affiliate: {
              refCode: option.preRefCode,
              referral: preRefExchangeInfo.length,
              totalEarned: totalPreRefAmount,
              refList: preRefExchangeInfo,
            },
          };
        } else {
          result[roundId] = {
            ticket: ticket,
            historyList: exchangeList,
          };
        }
      } else {
        result[roundId] = {
          ticket: ticket,
          historyList: exchangeList,
        };
      }
    }

    return result;
  }
  //debug blockchain

  async debugBlockChain(
    from: string,
    to: string,
    _amount: number,
    transactionHash: string,
  ): Promise<any> {
    const amount = _amount;
    //get current presave
    const currentPreSale = this.getCurrentPreSale();
    const ownerWallet = this.configService.get<string>('ownerWallet');
    if (ownerWallet.toLowerCase() == to.toLowerCase() && amount == currentPreSale.ticketPrice) {
      console.log(`${from} => ${to}: ${amount}: ${transactionHash}`);

      //update or insert user
      const userInfo = await this.userService.upsertUser(from);

      //create exchange
      let createData: IExchange = {
        wallet: from,
        transactionHash: transactionHash,
        ownerWallet: to,
        amount: amount,
        roundId: currentPreSale?.id,
        price: currentPreSale?.price,
        ticketPrice: currentPreSale?.ticketPrice,
        amountForOneTicket: currentPreSale?.amountForOneTicket,
        exchangeType: currentPreSale?.exchangeType,
        amountToken: currentPreSale?.amountForOneTicket,
        amountTicket: 1,
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      };
      //process for presale ref
      if (currentPreSale?.isPreRef && userInfo?.preRefCode) {
        const preRefUser = await this.userService.getUserInfoByPreRefCode(userInfo?.preRefCode);
        if (preRefUser) {
          createData = {
            ...createData,
            preRefAmount: currentPreSale?.preRefAmount,
            preRefWallet: preRefUser.wallet,
          };
        }
      }
      return await this.createExchange(createData);
    }
  }
}
