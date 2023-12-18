import { Injectable } from '@nestjs/common';
import { StoreRepository } from '../repositories/store.repository';
import * as moment from 'moment';
@Injectable()
export class StoreService {
  constructor(private storeRepository: StoreRepository) {}
  /**
   *
   * @param paginationParam
   * @returns
   */

  public async createStoreHistory(data) {
    await this.storeRepository.create({
      owner: data?.owner,
      nft: data?.nft,
      price: data?.price,
      transactionHash: data?.transactionHash,
      buyTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
  }
}
