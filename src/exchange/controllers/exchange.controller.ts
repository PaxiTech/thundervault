import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { pagination } from '@src/common/decorators/pagination';
import { PaginateDto } from '@src/common/dtos/paginate.dto';
import { ExchangeBuyDto } from '@src/exchange/dtos/buy.dto';
import { ExchangeListResponse } from '@src/exchange/dtos/exchange-response.dto';
import { FilterExchangeListDto } from '@src/exchange/dtos/list.dto';
import { ExchangeService } from '@src/exchange/services/exchange.services';
import { AuthenticationGuard } from '@src/user/guards/jwt.guard';
import { ErrorResponse } from '@src/common/contracts/openapi';
import {
  ExchangeItemResponse,
  OpenSaleItemResponse,
  CommonConfigItemResponse,
} from '@src/exchange/dtos/exchange-response.dto';

@ApiTags('Exchange')
@Controller()
export class ExchangeController {
  constructor(private exchangeService: ExchangeService) {}

  @Post('buy')
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ExchangeItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async buy(@Body() exchangeBuyDto: ExchangeBuyDto, @Request() request) {
    const wallet = request.user.wallet;
    const _id = request.user._id;
    const result = this.exchangeService.buyPreSale(_id, wallet, exchangeBuyDto);
    return result;
  }

  @Get('open-sale')
  @ApiOkResponse({ type: OpenSaleItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async getOpenSale() {
    const result = await this.exchangeService.getCurrentPreSaleInfo();
    return result;
  }

  @Get('history')
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ExchangeListResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @ApiQuery({ type: PaginateDto })
  async getExchangeHistory(
    @pagination() paginationParam: PaginateDto,
    @Body() filterExchangeListDto: FilterExchangeListDto,
    @Request() request,
  ) {
    const wallet = request.user.wallet;
    const _id = request.user._id;
    const result = await this.exchangeService.getExchangeHistory(
      _id,
      wallet,
      filterExchangeListDto,
      paginationParam,
    );
    return result;
  }

  @Get('common-config')
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: CommonConfigItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async getCommonConfig() {
    const result = await this.exchangeService.getCommonConfig();
    return result;
  }
}
