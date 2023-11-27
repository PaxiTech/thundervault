import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponse } from '@src/common/contracts/openapi';
import { PoolItemResponse } from '@src/pool/dtos/pool-response.dto';
import { PoolService } from '@src/pool/services/pool.services';
import { AuthenticationGuard } from '@src/user/guards/jwt.guard';
import { StakingDto } from '@src/pool/dtos/staking.dto';
import { NftListResponse } from '@src/nft/dtos/nft-response.dto';
import { PaginateDto } from '@src/common/dtos/paginate.dto';
import { pagination } from '@src/common/decorators/pagination';
import { FilterNftListDto } from '@src/nft/dtos/list.dto';
import { NftService } from '@src/nft/services/nft.services';
import { NFT_STATUS } from '@src/nft/schemas/nft.schema';
import { CommonDto } from '@src/common/dtos/common.dto';
@ApiTags('Pool')
@Controller('pool')
export class PoolController {
  constructor(private poolService: PoolService, private nftService: NftService) {}

  @Post('staking')
  @ApiOkResponse({ type: PoolItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  async staking(@Body() stakingDto: StakingDto) {
    //const result = await this.poolService.staking(stakingDto);
    //return result;
  }
  @Post('')
  @ApiOkResponse({ type: NftListResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @ApiQuery({ type: PaginateDto })
  async getUserNftPool(@pagination() paginationParam: PaginateDto, @Body() commonDto: CommonDto) {
    const { wallet } = commonDto;
    const result = await this.nftService.getUserNftPool(
      wallet,
      NFT_STATUS.STAKING,
      paginationParam,
    );
    return result;
  }
}
