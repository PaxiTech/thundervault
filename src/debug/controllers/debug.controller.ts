import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponse } from '@src/common/contracts/openapi';
import { ActionDto } from '@src/nft/dtos/action.dto';
import { NftItemResponse } from '@src/nft/dtos/nft-response.dto';
import { DebugService } from './../services/debug.services';
import { NFT_ACTION } from '@src/nft/schemas/nft.schema';

@ApiTags('Debug')
@Controller('debug')
export class DebugController {
  constructor(private debugService: DebugService) {}
  @Get(':level/:token.json')
  @ApiOkResponse({ type: NftItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async generateNft(@Param('level') level: number, @Param('token') token: string) {
    const result = await this.debugService.generateNft(token, level);
    return result;
  }

  @Post('add-market')
  @ApiOkResponse({ type: NftItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async addNftToMarket(@Body() actionDto: ActionDto) {
    const action = NFT_ACTION.market;
    const result = await this.debugService.addNftToMarket({ ...actionDto, action: action });
    return result;
  }

  @Post('staking')
  @ApiOkResponse({ type: NftItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async staking(@Body() actionDto: ActionDto) {
    const action = NFT_ACTION.staking;
    const result = await this.debugService.stakingNft({ ...actionDto, action: action });
    return result;
  }

  @Post('unstaking')
  @ApiOkResponse({ type: NftItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async unStaking(@Body() actionDto: ActionDto) {
    const action = NFT_ACTION.unStaking;
    const result = await this.debugService.unStakingNft({ ...actionDto, action: action });
    return result;
  }

  @Post('buy-from-store')
  @ApiOkResponse({ type: NftItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async buyNftFromStore(@Body() actionDto: ActionDto) {
    const action = NFT_ACTION.buy;
    const result = await this.debugService.buyNftFromStore({ ...actionDto, action: action });
    return result;
  }

  @Post('buy-from-market')
  @ApiOkResponse({ type: NftItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async buyNftFromMarket(@Body() actionDto: ActionDto) {
    const action = NFT_ACTION.buy;
    const result = await this.debugService.buyNftFromMarket({ ...actionDto, action: action });
    return result;
  }
}
