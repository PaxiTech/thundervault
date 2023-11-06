import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { pagination } from '@src/common/decorators/pagination';
import { PaginateDto } from '@src/common/dtos/paginate.dto';
import { FilterNftListDto } from '@src/nft/dtos/list.dto';
import { NftListResponse, NftItemResponse } from '@src/nft/dtos/nft-response.dto';
import { NftService } from '@src/nft/services/nft.services';
import { LoginOperatorDto } from '@src/operator/dtos/operator-login.dto';
import { OperatorTokenResponse } from '@src/operator/dtos/operator.response.dto';
import { AuthenticationOperatorGuard } from '@src/operator/guards/jwt.guard';
import { OperatorService } from '@src/operator/services/operator.services';
import { ErrorResponse } from 'src/common/contracts/openapi';
import { CreateNftDto } from '@src/nft/dtos/create.dto';
@ApiTags('Operator')
@Controller('operator')
export class OperatorController {
  constructor(private operatorService: OperatorService, private nftService: NftService) {}

  @Post('login')
  @ApiOkResponse({ type: OperatorTokenResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async login(@Body() loginOperatorDto: LoginOperatorDto) {
    const result = await this.operatorService.loginOperator(loginOperatorDto);
    return result;
  }

  @Post('nft/create')
  @ApiOkResponse({ type: NftItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @UseGuards(AuthenticationOperatorGuard)
  @ApiBearerAuth()
  async create(@Body() createNftDto: CreateNftDto) {
    const result = await this.nftService.createNft(createNftDto);
    return result;
  }

  @Post('nft/list')
  @ApiOkResponse({ type: NftListResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @ApiQuery({ type: PaginateDto })
  @UseGuards(AuthenticationOperatorGuard)
  @ApiBearerAuth()
  async getNftList(
    @pagination() paginationParam: PaginateDto,
    @Body() filterNftListDto: FilterNftListDto,
  ) {
    const result = await this.nftService.getNftList(filterNftListDto, paginationParam);
    return result;
  }
}
