import { Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponse } from '@src/common/contracts/openapi';
import { BlockchainService } from './../blockchain.service';

@ApiTags('Blockchain')
@Controller()
export class BlockchainController {
  constructor(private blockService: BlockchainService) {}

  @Post('debug')
  @ApiBadRequestResponse({ type: ErrorResponse })
  async getCommonConfig() {
    const result = await this.blockService.debugSavePresave();
    return result;
  }
}
