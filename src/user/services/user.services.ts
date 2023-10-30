import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Errors } from '@src/common/contracts/error';
import { AppException } from '@src/common/exceptions/app.exception';
import { UserRepository } from '@src/user/repositories/user.repository';
import { UserDocument } from '@src/user/schemas/user.schema';
@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userRepository: UserRepository,
  ) {}

  public async getUserInfo(wallet: string): Promise<any> {
    const conditions = {
      wallet: wallet,
    };
    const entity = await this.userRepository.findOne({
      conditions: conditions,
    });
    if (!entity) {
      const { code, message, status } = Errors.ACCOUNT_NOT_EXIST;
      throw new AppException(code, message, status);
    }
    const userInfo = this.populateUserInfo(entity);
    return userInfo;
  }
  /**
   * populateUserInfo
   * @param user {UserDocument}
   * @returns
   */
  public populateUserInfo(user: UserDocument) {
    const data = {
      wallet: user.wallet,
      createdAt: (user as any).createdAt,
      updatedAt: (user as any).updatedAt,
    };
    return data;
  }

  public async upsertUser(wallet: string) {
    let entity = await this.userRepository.findOne({
      conditions: { wallet: wallet },
    });
    if (!entity) entity = await this.userRepository.create({ wallet: wallet });
    return entity;
  }
}
