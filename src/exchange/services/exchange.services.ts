import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Errors } from '@src/common/contracts/error';
import { PaginateDto } from '@src/common/dtos/paginate.dto';
import { AppException } from '@src/common/exceptions/app.exception';
import { presaleConfig } from '@src/exchange/contracts/exchange-config';
import { CommonConfigItem, ExchangeListItem } from '@src/exchange/dtos/exchange-response.dto';
import { FilterExchangeListDto } from '@src/exchange/dtos/list.dto';
import { ExchangeRepository } from '@src/exchange/repositories/exchange.repository';
import { ExchangeDocument } from '@src/exchange/schemas/exchange.schema';
import { UtilHelperService } from '@src/utils/helper.service';
import { get as _get, isEmpty as _isEmpty } from 'lodash';
import * as moment from 'moment-timezone';
import { Types } from 'mongoose';

@Injectable()
export class ExchangeService {
  constructor(
    private exchangeRepository: ExchangeRepository,
    private configService: ConfigService,
    private helperService: UtilHelperService,
  ) { }

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

  public async createExchange(createData): Promise<any> {
    const exchangeEntity = await this.exchangeRepository.create(createData);
    const exchangeInfo = this.populateExchangeInfo(exchangeEntity);
    return exchangeInfo;
  }
}
