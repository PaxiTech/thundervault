import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponse } from '@src/common/contracts/openapi';
import { CommonDto } from '@src/common/dtos/common.dto';
import { UserService } from '@src/user/services/user.services';
import { UserItemResponse } from '@src/user/dtos/user-response.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('profile')
  @ApiOkResponse({ type: UserItemResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async getProfile(@Body() commonDto: CommonDto) {
    const { wallet } = commonDto;
    const result = await this.userService.getUserInfo(wallet);
    return result;
  }
}
