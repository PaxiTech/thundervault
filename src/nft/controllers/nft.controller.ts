import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { NftService } from '@src/nft/services/nft.services';
import { ErrorResponse } from 'src/common/contracts/openapi';
import { NftItemResponse } from '@src/nft/dtos/nft-response.dto';
import { DetailNftDto } from '@src/nft/dtos/list.dto';
@ApiTags('Nft')
@Controller('nft')
export class NftController {
  constructor(private nftService: NftService) {}

  @Post('detail')
  @ApiOkResponse({ type: NftItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async getNftInfo(@Body() detailNftDto: DetailNftDto) {
    const { token } = detailNftDto;
    const result = await this.nftService.getNftInfo(token);
    return result;
  }
}
