import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Patch,
  Get,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { LoginDto } from '@src/user/dtos/login.dto';
import { UserService } from '@src/user/services/user.services';
import { ErrorResponse, TokenResponse } from '@src/common/contracts/openapi';
import { AuthenticationGuard } from '@src/user/guards/jwt.guard';
import { UserKycDto } from '@src/user/dtos/kyc.dto';
import { UserResponse } from '@src/user/contracts/openapi';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('login')
  @ApiCreatedResponse({ type: TokenResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async login(@Body() loginDto: LoginDto) {
    const data = await this.userService.loginUser(loginDto);
    return data;
  }

  // @Patch('kyc')
  // @UseGuards(AuthenticationGuard)
  // @ApiOkResponse({ type: UserResponse })
  // @ApiBadRequestResponse({ type: ErrorResponse })
  // @ApiBearerAuth()
  // async kyc(@Body() userKycDto: UserKycDto, @Request() request) {
  //   const wallet = request.user.wallet;
  //   const _id = request.user._id;
  //   const isVerifiedKYC = await this.userService.isVerifiedKYC(_id, wallet);
  //   if (!isVerifiedKYC) {
  //     const result = await this.userService.kyc(_id, wallet, userKycDto);
  //     return result;
  //   }
  // }

  @Get('profile')
  @UseGuards(AuthenticationGuard)
  @ApiOkResponse({ type: UserResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @ApiBearerAuth()
  async getProfile(@Request() request) {
    const wallet = request.user.wallet;
    const _id = request.user._id;
    const result = await this.userService.getUserInfo(_id, wallet);
    return result;
  }
}
