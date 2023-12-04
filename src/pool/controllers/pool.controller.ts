import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponse } from '@src/common/contracts/openapi';
import { CommonDto } from '@src/common/dtos/common.dto';
import { NftService } from '@src/nft/services/nft.services';
import { PoolInfoResponse } from '@src/pool/dtos/pool-response.dto';
import { PoolService } from '@src/pool/services/pool.services';
@ApiTags('Pool')
@Controller('pool')
export class PoolController {
  constructor(private poolService: PoolService, private nftService: NftService) {}

  @Post('info')
  @ApiOkResponse({ type: PoolInfoResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async info(@Body() commonDto: CommonDto) {
    const { wallet } = commonDto;
    const result = await this.poolService.poolInfo(wallet);
    return result;
  }
}
