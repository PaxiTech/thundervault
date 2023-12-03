import { Param, Controller, Get, Post, Body } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { NftService } from '@src/nft/services/nft.services';
import { ErrorResponse } from 'src/common/contracts/openapi';
import { NftItemResponse } from '@src/nft/dtos/nft-response.dto';
import { DetailDto } from '@src/nft/dtos/detail.dto';
import { ActionDto } from '../dtos/action.dto';
import { NFT_ACTION } from '@src/nft/schemas/nft.schema';
@ApiTags('Nft')
@Controller('nft')
export class NftController {
  constructor(private nftService: NftService) {}

  // @Get(':level/:token.json')
  // @ApiOkResponse({ type: NftItemResponse })
  // @ApiBadRequestResponse({ type: ErrorResponse })
  // async generateNft(@Param('level') level: number, @Param('token') token: string) {
  //   const result = await this.nftService.generateNft(token, level);
  //   return result;
  // }

  @Post('detail')
  @ApiOkResponse({ type: NftItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async getNftInfo(@Body() detailDto: DetailDto) {
    const { token } = detailDto;
    const result = await this.nftService.getNftInfo(token);
    return result;
  }

  @Post('add-market')
  @ApiOkResponse({ type: NftItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async addNftToMarket(@Body() actionDto: ActionDto) {
    const action = NFT_ACTION.market;
    const result = await this.nftService.addNftToMarket({ ...actionDto, action: action });
    return result;
  }

  @Post('staking')
  @ApiOkResponse({ type: NftItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async staking(@Body() actionDto: ActionDto) {
    const action = NFT_ACTION.staking;
    const result = await this.nftService.stakingNft({ ...actionDto, action: action });
    return result;
  }

  @Post('buy-from-store')
  @ApiOkResponse({ type: NftItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async buyNftFromStore(@Body() actionDto: ActionDto) {
    const action = NFT_ACTION.buy;
    const result = await this.nftService.buyNftFromStore({ ...actionDto, action: action });
    return result;
  }

  @Post('buy-from-market')
  @ApiOkResponse({ type: NftItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async buyNftFromMarket(@Body() actionDto: ActionDto) {
    const action = NFT_ACTION.buy;
    const result = await this.nftService.buyNftFromMarket({ ...actionDto, action: action });
    return result;
  }
}
