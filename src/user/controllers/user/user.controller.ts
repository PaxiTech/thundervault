import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponse } from '@src/common/contracts/openapi';
import { UserService } from '@src/user/services/user.services';
import { UserItemResponse } from '@src/user/dtos/user-response.dto';
import { UserPreRefDto } from '@src/user/dtos/user-presale-referral.dto';
import { ExchangeService } from '@src/exchange/services/exchange.services';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService, private exchangeService: ExchangeService) {}

  @Post('profile')
  @ApiOkResponse({ type: UserItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async getProfile(@Body() userPreRefDto: UserPreRefDto) {
    const { wallet, refCode } = userPreRefDto;
    const userInfo = await this.userService.createUpdateProfile(wallet, { refCode: refCode });
    const summary = await this.exchangeService.getSummaryByUser(wallet, {
      preRefCode: userInfo.myRefCode,
    });
    return { ...userInfo, presale: { ...summary } };
  }
}
