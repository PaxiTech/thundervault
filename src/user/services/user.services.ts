import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Errors } from '@src/common/contracts/error';
import { AppException } from '@src/common/exceptions/app.exception';
import { UserRepository } from '@src/user/repositories/user.repository';
import { UserDocument } from '@src/user/schemas/user.schema';
import { get as _get, isEmpty as _isEmpty } from 'lodash';
import { UserItem } from '@src/user/dtos/user-response.dto';
@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userRepository: UserRepository,
  ) {}

  //process for presale referral code

  public async addPreRefCode(wallet: string, preRefCode: string) {
    const conditions = { wallet: wallet };
    const options = { new: true };
    const entity = await this.userRepository.findOneAndUpdate(
      conditions,
      { preRefCode: preRefCode },
      options,
    );

    return entity;
  }

  public async addRefCode(wallet: string, refCode: string) {
    const conditions = { wallet: wallet };
    const options = { new: true };
    const entity = await this.userRepository.findOneAndUpdate(
      conditions,
      { refCode: refCode },
      options,
    );

    return entity;
  }

  public async getUserInfoByPreRefCode(preRefCode: string): Promise<UserItem> {
    //tìm user có myrefcode là prerefcode cua user cần tìm.
    const conditions = { myRefCode: preRefCode };
    const entity = await this.userRepository.findOne({
      conditions: conditions,
    });
    if (!entity) {
      return null;
    }
    const userInfo = this.populateUserInfo(entity);
    return userInfo;
  }
  //function lấy profile. khi lấy profile nếu chưa có myref sẽ tạo myref. nếu có gửi presale ref thì sẽ tạo presale ref
  public async createUpdateProfile(wallet: string, option?: any) {
    let entity = await this.userRepository.findOne({
      conditions: { wallet: wallet },
    });
    const myRefCode = await this.generateMyRefCode();
    if (!entity)
      entity = await this.userRepository.create({
        wallet: wallet,
        myRefCode: myRefCode,
      });
    //nếu chưa tạo referral code thì sẽ tạo. case này xử lý cho những user được tạo trước lúc release chức năng referral code.
    if (_isEmpty(entity?.myRefCode)) {
      entity = await this.addMyRefCode(wallet);
    }
    // tạo refCode hoặc preRefCode
    if (!_isEmpty(option?.refCode) && (_isEmpty(entity?.preRefCode) || _isEmpty(entity?.refCode))) {
      //kiểm tra tính hợp lệ của refCode
      const parentUser = await this.userRepository.findOne({
        conditions: { myRefCode: option?.refCode },
      });
      //không tồn tại mã ref
      if (!parentUser) {
        const { code, message, status } = Errors.REFERRAL_CODE_INVALID;
        throw new AppException(code, message, status);
      }
      // không thể giới thiệu chính mình.
      if (parentUser.wallet == wallet) {
        const { code, message, status } = Errors.REFERRAL_CODE_INVALID_YOURSELF;
        throw new AppException(code, message, status);
      }
      entity = await this.addPreRefCode(wallet, option?.refCode);
      entity = await this.addRefCode(wallet, option?.refCode);
    }
    const userInfo = this.populateUserInfo(entity, { getRefCode: true });
    return userInfo;
  }
  public async getUserInfo(wallet: string, option?: any): Promise<any> {
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
    const userInfo = this.populateUserInfo(entity, option);
    return userInfo;
  }
  /**
   * populateUserInfo
   * @param user {UserDocument}
   * @returns
   */
  public populateUserInfo(user: UserDocument, options?: any): UserItem {
    let data = {
      _id: _get(user, '_id'),
      wallet: user.wallet,
      myRefCode: _get(user, 'myRefCode', ''),
      preRefCode: _get(user, 'preRefCode', ''),
      refCode: _get(user, 'refCode', ''),
      level: user?.level || 0,
      createdAt: _get(user, 'createdAt'),
      updatedAt: _get(user, 'updatedAt'),
    };
    if (options?.getRefCode) {
      const myRefCode = {
        refLevel1: user.refLevel1,
        refLevel2: user.refLevel2,
        refLevel3: user.refLevel3,
        refLevel4: user.refLevel4,
        refLevel5: user.refLevel5,
        refLevel6: user.refLevel6,
        refLevel7: user.refLevel7,
        refLevel8: user.refLevel8,
      };
      data = { ...data, ...myRefCode };
    }
    return data;
  }

  public async addMyRefCode(wallet: string) {
    const myRefCode = await this.generateMyRefCode();
    const conditions = { wallet: wallet };
    const options = { new: true };
    const entity = await this.userRepository.findOneAndUpdate(
      conditions,
      { myRefCode: myRefCode },
      options,
    );

    return entity;
  }

  public async upsertUser(wallet: string) {
    let entity = await this.userRepository.findOne({
      conditions: { wallet: wallet },
    });
    const myRefCode = await this.generateMyRefCode();
    if (!entity)
      entity = await this.userRepository.create({
        wallet: wallet,
        myRefCode: myRefCode,
      });
    return entity;
  }

  //general user referral code
  public async generateMyRefCode(): Promise<string> {
    let myRefCode: string;
    let isUnique = false;

    while (!isUnique) {
      myRefCode = this.generateRandomCode(10); // Set the desired code length here

      const existingCode = await this.userRepository.findOne({
        conditions: { myRefCode: myRefCode },
      });

      isUnique = !existingCode;
    }

    return myRefCode;
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

  public async processMyRefCode(wallet: string, parentWallet: string): Promise<UserItem> {
    const parentUserInfo = await this.getUserInfo(parentWallet, { getRefCode: true });
    const conditions = { wallet: wallet };
    const options = { new: true };
    //set referral code from referral code of parent
    const updateData = {
      refLevel1: parentWallet,
      refLevel2: parentUserInfo.refLevel1,
      refLevel3: parentUserInfo.refLevel2,
      refLevel4: parentUserInfo.refLevel3,
      refLevel5: parentUserInfo.refLevel4,
      refLevel6: parentUserInfo.refLevel5,
      refLevel7: parentUserInfo.refLevel6,
      refLevel8: parentUserInfo.refLevel7,
    };
    const entity = await this.userRepository.findOneAndUpdate(conditions, updateData, options);
    return this.populateUserInfo(entity);
  }

  public async getUserInfoByMyRefCode(myRefCode: string): Promise<UserItem> {
    const conditions = { myRefCode: myRefCode };
    const entity = await this.userRepository.findOne({
      conditions: conditions,
    });
    if (!entity) {
      const { code, message, status } = Errors.REFERRAL_CODE_INVALID;
      throw new AppException(code, message, status);
    }
    const userInfo = this.populateUserInfo(entity);
    return userInfo;
  }

  public async updateUserLevel(wallet: string, level: number) {
    let userInfo = await this.getUserInfo(wallet);
    const userLevel = userInfo.level;
    if (userLevel < level) {
      const conditions = { wallet: wallet };
      const options = { new: true };
      userInfo = await this.userRepository.findOneAndUpdate(conditions, { level: level }, options);
    }

    return userInfo;
  }
}
