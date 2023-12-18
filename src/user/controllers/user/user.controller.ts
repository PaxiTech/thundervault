import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ErrorResponse } from '@src/common/contracts/openapi';
import { UserService } from '@src/user/services/user.services';
import { UserItemResponse } from '@src/user/dtos/user-response.dto';
import { UserPreRefDto } from '@src/user/dtos/user-presale-referral.dto';
import { ExchangeService } from '@src/exchange/services/exchange.services';
import { NftService } from '@src/nft/services/nft.services';
import { NftListResponse } from '@src/nft/dtos/nft-response.dto';
import { PaginateDto } from '@src/common/dtos/paginate.dto';
import { pagination } from '@src/common/decorators/pagination';
import { NFT_STATUS } from '@src/nft/schemas/nft.schema';
import { UserListNftDto } from '@src/user/dtos/user-list-nft.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private exchangeService: ExchangeService,
    private nftService: NftService,
  ) {}

  @Post('profile')
  @ApiOkResponse({ type: UserItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async getProfile(@Body() userPreRefDto: UserPreRefDto) {
    const { wallet, refCode } = userPreRefDto;
    const userInfo = await this.userService.createUpdateProfile(wallet, { refCode: refCode });
    const myNft = await this.nftService.getNftByUser(wallet);
    const summary = await this.exchangeService.getSummaryByUser(wallet, {
      preRefCode: userInfo.myRefCode,
    });
    const allNftStaked = await this.nftService.getAllNftByUser(wallet, NFT_STATUS.STAKING);
    const myCommissionFee = await this.nftService.getCurrentTotalCommissionFeeByUser(wallet);
    const myTotalNftStaked = await this.nftService.countNftStakedByUser(wallet);
    const pool = {
      nft: allNftStaked,
      myCommissionFee: myCommissionFee,
      myTotalNftStaked: myTotalNftStaked,
    };
    return { ...userInfo, presale: { ...summary }, nft: myNft, pool: pool };
  }
  @Post('nft')
  @ApiOkResponse({ type: NftListResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @ApiQuery({ type: PaginateDto })
  async getUserNftPool(
    @pagination() paginationParam: PaginateDto,
    @Body() userListNftDto: UserListNftDto,
  ) {
    const { wallet, status } = userListNftDto;
    const result = await this.nftService.getListNftByUser(wallet, status, paginationParam);
    return result;
  }
}
