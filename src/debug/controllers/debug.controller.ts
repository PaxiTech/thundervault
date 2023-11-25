import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponse } from '@src/common/contracts/openapi';
import { ExchangeAddManualDto } from '@src/exchange/dtos/buy.dto';
import { ExchangeItemResponse } from '@src/exchange/dtos/exchange-response.dto';
import { NftItemResponse } from '@src/nft/dtos/nft-response.dto';
import { ExchangeService } from '@src/exchange/services/exchange.services';

@ApiTags('Debug')
@Controller('debug')
export class DebugController {
  constructor(private exchangeService: ExchangeService) {}

  @Post('buy')
  @ApiOkResponse({ type: ExchangeItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async debug(@Body() exchangeAddManualDto: ExchangeAddManualDto) {
    const { from, to, amount, transactionHash } = exchangeAddManualDto;
    const result = await this.exchangeService.debugBlockChain(from, to, amount, transactionHash);
    return result;
  }

  @Post('add-market')
  @ApiOkResponse({ type: NftItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async addNftToMarket(@Body() exchangeAddManualDto: ExchangeAddManualDto) {
    const { from, to, amount, transactionHash } = exchangeAddManualDto;
    const result = await this.exchangeService.debugBlockChain(from, to, amount, transactionHash);
    return result;
  }
}
