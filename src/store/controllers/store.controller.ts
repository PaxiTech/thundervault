import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BlockchainService } from '@src/blockchain/blockchain.service';
import { ErrorResponse } from '@src/common/contracts/openapi';
import { NftService } from '@src/nft/services/nft.services';
import { StoreListDto } from '@src/store/dtos/list.dto';
import { StoreItemResponse, StoreListResponse } from '@src/store/dtos/store-response.dto';
import { StoreService } from '@src/store/services/store.services';
import { StoreBuyNftDto } from '../dtos/store-buy-nft.dto';

@ApiTags('Store')
@Controller('store')
export class StoreController {
  constructor(
    private storeService: StoreService,
    private nftService: NftService,
    private blockchainService: BlockchainService,
  ) {}

  @Post('')
  @ApiOkResponse({ type: StoreListResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async getStoreList() {
    //const rate = await this.blockchainService.getRateTokenUsdt();
    const rate = 1;
    const result = await this.nftService.getStoreList(rate);
    return result;
  }

  @Post('staking')
  @ApiOkResponse({ type: StoreItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async buyNft(@Body() storeBuyNftDto: StoreBuyNftDto) {
    const { wallet, level, type } = storeBuyNftDto;
    // const rate = await this.blockchainService.getRateTokenUsdt();
    const rate = 1;
    const result = await this.nftService.getNftInfoToBuyNft(wallet, level, type, rate);
    return result;
  }

  @Post('detail')
  @ApiOkResponse({ type: StoreItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async detail(@Body() storeBuyNftDto: StoreBuyNftDto) {
    const { level, type } = storeBuyNftDto;
    // const rate = await this.blockchainService.getRateTokenUsdt();
    const rate = 1;
    const result = await this.nftService.getDetailStore(level, type, rate);
    return result;
  }
}
