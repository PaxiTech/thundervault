import { Param, Controller, Get } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { NftService } from '@src/nft/services/nft.services';
import { ErrorResponse } from 'src/common/contracts/openapi';
import { NftItemResponse } from '@src/nft/dtos/nft-response.dto';
@ApiTags('Nft')
@Controller('nft')
export class NftController {
  constructor(private nftService: NftService) {}

  @Get(':level/:token.json')
  @ApiOkResponse({ type: NftItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async generateNft(@Param('level') level: number, @Param('token') token: string) {
    const result = await this.nftService.generateNft(token, level);
    return result;
  }
}
