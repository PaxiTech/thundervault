import { Injectable } from '@nestjs/common';
import { NftService } from '@src/nft/services/nft.services';

@Injectable()
export class StoreService {
  constructor(private nftService: NftService) {}
  /**
   *
   * @param paginationParam
   * @returns
   */
}
