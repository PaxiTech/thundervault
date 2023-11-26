import { Body, Controller, Post, Request } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponse } from '@src/common/contracts/openapi';
import { pagination } from '@src/common/decorators/pagination';
import { PaginateDto } from '@src/common/dtos/paginate.dto';
import { MarketListResponse } from '@src/market/dtos/market-response.dto';
import { MarketListDto } from '@src/market/dtos/list.dto';
import { MarketService } from '@src/market/services/market.services';
import { NftService } from '@src/nft/services/nft.services';
import { NFT_STATUS } from '@src/nft/schemas/nft.schema';

@ApiTags('Market')
@Controller('market')
export class MarketController {
  constructor(private marketService: MarketService, private nftService: NftService) {}

  @Post('')
  @ApiOkResponse({ type: MarketListResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @ApiQuery({ type: PaginateDto })
  async getNftMarketList(
    @pagination() paginationParam: PaginateDto,
    @Body() marketListDto: MarketListDto,
  ) {
    const result = await this.nftService.getListNftByStatus(
      NFT_STATUS.MARKET,
      marketListDto,
      paginationParam,
    );
    return result;
  }
}
