import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponse } from '@src/common/contracts/openapi';
import { UserService } from '@src/user/services/user.services';
import { UserItemResponse } from '@src/user/dtos/user-response.dto';
import { UserPreRefDto } from '@src/user/dtos/user-presale-referral.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('profile')
  @ApiOkResponse({ type: UserItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async getProfile(@Body() userPreRefDto: UserPreRefDto) {
    const { wallet, preRefCode } = userPreRefDto;
    const result = await this.userService.createUpdateProfile(wallet, { preRefCode: preRefCode });
    return result;
  }
}
