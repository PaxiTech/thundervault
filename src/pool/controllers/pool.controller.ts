import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponse } from '@src/common/contracts/openapi';
import { PoolItemResponse } from '@src/pool/dtos/pool-response.dto';
import { PoolService } from '@src/pool/services/pool.services';
import { AuthenticationGuard } from '@src/user/guards/jwt.guard';
import { StakingDto } from '@src/pool/dtos/staking.dto';
@ApiTags('Pool')
@Controller()
export class PoolController {
  constructor(private poolService: PoolService) {}

  @Post('staking')
  @ApiOkResponse({ type: PoolItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  async staking(@Body() stakingDto: StakingDto) {
    //const result = await this.poolService.staking(stakingDto);
    //return result;
  }
}
