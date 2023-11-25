import { Injectable } from '@nestjs/common';
import { NftService } from '@src/nft/services/nft.services';

@Injectable()
export class MarketService {
  constructor(private nftService: NftService) {}
  /**
   *
   * @param paginationParam
   * @returns
   */
}
