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
import { StoreListResponse } from '@src/store/dtos/store-response.dto';
import { StoreListDto } from '@src/store/dtos/list.dto';
import { StoreService } from '@src/store/services/store.services';
import { NftService } from '@src/nft/services/nft.services';

@ApiTags('Store')
@Controller('store')
export class StoreController {
  constructor(private storeService: StoreService, private nftService: NftService) {}

  @Post('')
  @ApiOkResponse({ type: StoreListResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async getStoreHistory(@Body() storeListDto: StoreListDto) {
    const result = await this.nftService.getStoreList(storeListDto);
    return result;
  }
}
