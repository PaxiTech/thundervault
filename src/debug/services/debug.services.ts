import { Injectable } from '@nestjs/common';
import { ActionDto } from '@src/nft/dtos/action.dto';
import { NftService } from '@src/nft/services/nft.services';

@Injectable()
export class DebugService {
  constructor(private nftService: NftService) {}

  public async addNftToMarket(actionDto: ActionDto) {
    return await this.nftService.addToMarket(actionDto);
  }

  public async stakingNft(actionDto: ActionDto) {
    return await this.nftService.actionStaking(actionDto);
  }

  public async buyNftFromStore(actionDto: ActionDto) {
    return await this.nftService.buyNftFromStore(actionDto);
  }

  public async buyNftFromMarket(actionDto: ActionDto) {
    return await this.nftService.buyNftFromMarket(actionDto);
  }
}
