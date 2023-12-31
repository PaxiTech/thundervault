import { Injectable } from '@nestjs/common';
import { ActionDto } from '@src/nft/dtos/action.dto';
import { NftService } from '@src/nft/services/nft.services';

@Injectable()
export class DebugService {
  constructor(private nftService: NftService) {}

  public async addNftToMarket(actionDto: ActionDto) {
    return await this.nftService.addNftToMarket(actionDto);
  }
  public async generateNft(token: string, level: number) {
    return await this.nftService.generateNft('', token, level);
  }

  public async stakingNft(actionDto: ActionDto) {
    return await this.nftService.stakingNft(actionDto);
  }

  public async unStakingNft(actionDto: ActionDto) {
    return await this.nftService.unStakingNft(actionDto);
  }

  public async buyNftFromStore(actionDto: ActionDto) {
    return await this.nftService.buyNftFromStore(actionDto);
  }

  public async buyNftFromMarket(actionDto: ActionDto) {
    return await this.nftService.buyNftFromMarket(actionDto);
  }
}
