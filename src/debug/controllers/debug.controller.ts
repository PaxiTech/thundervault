import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponse } from '@src/common/contracts/openapi';
import { ActionDto } from '@src/nft/dtos/action.dto';
import { NftItemResponse } from '@src/nft/dtos/nft-response.dto';
import { DebugService } from './../services/debug.services';

@ApiTags('Debug')
@Controller('debug')
export class DebugController {
  constructor(private debugService: DebugService) {}
  @Post('add-market')
  @ApiOkResponse({ type: NftItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async addNftToMarket(@Body() actionDto: ActionDto) {
    const result = await this.debugService.addNftToMarket(actionDto);
    return result;
  }

  @Post('staking')
  @ApiOkResponse({ type: NftItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async staking(@Body() actionDto: ActionDto) {
    const result = await this.debugService.stakingNft(actionDto);
    return result;
  }

  @Post('buy-from-store')
  @ApiOkResponse({ type: NftItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async buyNftFromStore(@Body() actionDto: ActionDto) {
    const result = await this.debugService.buyNftFromStore(actionDto);
    return result;
  }

  @Post('buy-from-market')
  @ApiOkResponse({ type: NftItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async buyNftFromMarket(@Body() actionDto: ActionDto) {
    const result = await this.debugService.buyNftFromMarket(actionDto);
    return result;
  }
}
