import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Errors } from '@src/common/contracts/error';
import { PaginateDto } from '@src/common/dtos/paginate.dto';
import { AppException } from '@src/common/exceptions/app.exception';
import { presaleConfig } from '@src/exchange/contracts/exchange-config';
import { ExchangeBuyDto } from '@src/exchange/dtos/buy.dto';
import { ExchangeItem, ExchangeListItem } from '@src/exchange/dtos/exchange-response.dto';
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
  ) {}

  /**
   *
   * @param userId
   * @param wallet
   * @param data
   * @returns
   */
  public async buyPreSale(
    userId: string,
    wallet: string,
    exchangeBuydto: ExchangeBuyDto,
  ): Promise<any> {
    const currentPreSale = this.getCurrentPreSale();
    //check current round presale
    if (currentPreSale.id !== exchangeBuydto.roundId) {
      const { code, message, status } = Errors.INVALID_BUY_TIME;
      throw new AppException(code, message, status);
    }
    //check buy time
    const isValidBuyTime = this.isValidBuyTime(currentPreSale);
    if (!isValidBuyTime) {
      const { code, message, status } = Errors.INVALID_BUY_TIME;
      throw new AppException(code, message, status);
    }
    //check total amount
    const totalSaled = await this.getTotalHasBeenSale(currentPreSale.roundId);
    if (totalSaled + exchangeBuydto.amount > currentPreSale.maxAmount) {
      const { code, message, status } = Errors.OVER_MAX_AMOUNT;
      throw new AppException(code, message, status);
    }

    const createData = {
      ...exchangeBuydto,
      wallet: wallet,
      price: currentPreSale.price,
      exchangeType: currentPreSale.exchangeType,
      total: currentPreSale.price * exchangeBuydto.amount,
      createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      ownerId: new Types.ObjectId(userId),
    };

    const exchangeEntity = await this.exchangeRepository.create(createData);
    const exchangeInfo = this.populateExchangeInfo(exchangeEntity);
    return exchangeInfo;
  }

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
    userId: string,
    wallet: string,
    filterExchangeListDto: FilterExchangeListDto,
    paginationParam: PaginateDto,
  ): Promise<any> {
    const roundId = filterExchangeListDto.roundId ?? this.configService.get<string>('presaleId');
    const conditions = {
      ownerId: new Types.ObjectId(userId),
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
      totalAmountHadSale: totalSaled,
      totalUser: totalUser,
      totalTimesSale: totalTimesSaled,
    };
  }

  public isValidBuyTime(currentPreSale): boolean {
    const currentTime = this.helperService.getCurrentTime();
    const startSaleTime = moment(currentPreSale.startSaleTime).format('YYYY-MM-DD HH:mm:ss');
    const endTime = moment(currentPreSale.endTime).format('YYYY-MM-DD HH:mm:ss');
    if (currentTime >= startSaleTime && currentTime <= endTime) {
      return true;
    }
    return false;
  }
  /**
   * populateExchangeInfo
   * @param exchange {ExchangeDocument}
   * @returns
   */
  public populateExchangeInfo(exchange: ExchangeDocument): ExchangeItem {
    const data: ExchangeItem = {
      _id: _get(exchange, '_id'),
      token: exchange?.token,
      exchangeType: exchange?.exchangeType,
      status: exchange?.status,
      tokenName: exchange?.tokenName,
      tokenSymbol: exchange?.tokenSymbol,
      price: exchange?.price,
      amount: exchange?.amount,
      total: exchange?.total,
      discountPercent: exchange?.discountPercent,
      discountPrice: exchange?.discountPrice,
      discountTotal: exchange?.discountTotal,
      createTime: exchange?.createTime,
      wallet: exchange.wallet,
      ownerId: _get(exchange, 'ownerId'),
      createdAt: _get(exchange, 'createdAt'),
      updatedAt: _get(exchange, 'updatedAt'),
    };
    return data;
  }
}
