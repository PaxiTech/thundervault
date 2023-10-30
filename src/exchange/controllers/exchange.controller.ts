import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ErrorResponse } from '@src/common/contracts/openapi';
import { pagination } from '@src/common/decorators/pagination';
import { PaginateDto } from '@src/common/dtos/paginate.dto';
import {
  CommonConfigItemResponse,
  ExchangeListResponse,
  OpenSaleItemResponse,
} from '@src/exchange/dtos/exchange-response.dto';
import { FilterExchangeListDto } from '@src/exchange/dtos/list.dto';
import { ExchangeService } from '@src/exchange/services/exchange.services';

@ApiTags('Exchange')
@Controller()
export class ExchangeController {
  constructor(private exchangeService: ExchangeService) {}

  @Post('open-sale')
  @ApiOkResponse({ type: OpenSaleItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async getOpenSale() {
    const result = await this.exchangeService.getCurrentPreSaleInfo();
    return result;
  }

  @Post('history')
  @ApiOkResponse({ type: ExchangeListResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @ApiQuery({ type: PaginateDto })
  async getExchangeHistory(
    @pagination() paginationParam: PaginateDto,
    @Body() filterExchangeListDto: FilterExchangeListDto,
  ) {
    const { wallet } = filterExchangeListDto;
    const result = await this.exchangeService.getExchangeHistory(
      wallet,
      filterExchangeListDto,
      paginationParam,
    );
    return result;
  }

  @Post('common-config')
  @ApiOkResponse({ type: CommonConfigItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async getCommonConfig() {
    const result = await this.exchangeService.getCommonConfig();
    return result;
  }
}
