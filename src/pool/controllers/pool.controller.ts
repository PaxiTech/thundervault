import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponse } from '@src/common/contracts/openapi';
import { CommonDto, CommonOptionalDto } from '@src/common/dtos/common.dto';
import { NftService } from '@src/nft/services/nft.services';
import { PoolInfoResponse, PoolItemResponse } from '@src/pool/dtos/pool-response.dto';
import { PoolService } from '@src/pool/services/pool.services';
import { StakingDto } from '../dtos/staking.dto';
@ApiTags('Pool')
@Controller('pool')
export class PoolController {
  constructor(private poolService: PoolService, private nftService: NftService) {}

  @Post('info')
  @ApiOkResponse({ type: PoolInfoResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async info(@Body() commonOptionalDto: CommonOptionalDto) {
    const { wallet } = commonOptionalDto;
    const result = await this.poolService.poolInfo(wallet);
    return result;
  }

  // @Post('staking')
  // @ApiOkResponse({ type: PoolItemResponse })
  // @ApiBadRequestResponse({ type: ErrorResponse })
  // async staking(@Body() stakingDto: StakingDto) {
  //   const { wallet, token } = stakingDto;
  //   const result = await this.nftService.validateNftStaking(wallet, token);
  //   return result;
  // }
}
