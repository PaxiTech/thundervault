import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Errors } from '@src/common/contracts/error';
import { AppException } from '@src/common/exceptions/app.exception';
import { UserRepository } from '@src/user/repositories/user.repository';
import { UserDocument } from '@src/user/schemas/user.schema';
import { get as _get } from 'lodash';
@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userRepository: UserRepository,
  ) {}

  public async getUserInfo(wallet: string, option?: any): Promise<any> {
    const conditions = {
      wallet: wallet,
    };
    let entity = await this.userRepository.findOne({
      conditions: conditions,
    });
    if (!entity) {
      const { code, message, status } = Errors.ACCOUNT_NOT_EXIST;
      throw new AppException(code, message, status);
    }
    //nếu chưa tạo referral code thì sẽ tạo. case này xử lý cho những user được tạo trước lúc release chức năng referral code.
    if (!entity?.referralCode) {
      entity = await this.updateReferralCode(wallet);
    }
    const userInfo = this.populateUserInfo(entity);
    return userInfo;
  }
  /**
   * populateUserInfo
   * @param user {UserDocument}
   * @returns
   */
  public populateUserInfo(user: UserDocument, options?: any) {
    let data = {
      wallet: user.wallet,
      referralCode: user?.referralCode || '',
      level: user?.level || 0,
      createdAt: _get(user, 'createdAt'),
      updatedAt: _get(user, 'updatedAt'),
    };
    if (options?.getReferralCode) {
      const referralCode = {
        refLevel1: user.refLevel1,
        refLevel2: user.refLevel2,
        refLevel3: user.refLevel3,
        refLevel4: user.refLevel4,
        refLevel5: user.refLevel5,
        refLevel6: user.refLevel6,
        refLevel7: user.refLevel7,
        refLevel8: user.refLevel8,
      };
      data = { ...data, ...referralCode };
    }
    return data;
  }

  public async updateReferralCode(wallet: string) {
    const referralCode = await this.generateReferralCode();
    const conditions = { wallet: wallet };
    const options = { new: true };
    const entity = await this.userRepository.findOneAndUpdate(
      conditions,
      { referralCode: referralCode },
      options,
    );

    return entity;
  }

  public async upsertUser(wallet: string) {
    let entity = await this.userRepository.findOne({
      conditions: { wallet: wallet },
    });
    const referralCode = await this.generateReferralCode();
    if (!entity)
      entity = await this.userRepository.create({ wallet: wallet, referralCode: referralCode });
    return entity;
  }

  //general user referral code
  public async generateReferralCode(): Promise<string> {
    let referralCode: string;
    let isUnique = false;

    while (!isUnique) {
      referralCode = this.generateRandomCode(8); // Set the desired code length here

      const existingCode = await this.userRepository.findOne({
        conditions: { referralCode: referralCode },
      });

      isUnique = !existingCode;
    }

    return referralCode;
  }

  private generateRandomCode(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    return code;
  }
}
