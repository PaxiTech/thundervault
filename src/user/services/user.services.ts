import { UserDocument } from '@src/user/schemas/user.schema';
import { recoverPersonalSignature } from '@metamask/eth-sig-util';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '@src/user/dtos/login.dto';
import { JwtUser } from '@src/user/interfaces/user-service.interface';
import { Errors } from '@src/common/contracts/error';
import { AppException } from '@src/common/exceptions/app.exception';
import { UserRepository } from '@src/user/repositories/user.repository';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import { bufferToHex } from 'ethereumjs-util';
import { TokenResponse } from '@src/common/contracts/openapi';
import { kycStatuses } from '@src/user/contracts/type';
@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userRepository: UserRepository,
  ) { }

  public async loginUser(loginDto: LoginDto): Promise<TokenResponse> {
    const { accountAddress, signature } = loginDto;
    if (!this.configService.get<string>('debug')) {
      const data = bufferToHex(Buffer.from(accountAddress + accountAddress, 'utf8'));
      const recoveredAddr = recoverPersonalSignature({
        data,
        signature,
      });
      if (recoveredAddr.toLowerCase() !== accountAddress.toLowerCase()) {
        const { code, message, status } = Errors.INVALID_SIGNATURE;
        throw new AppException(code, message, status);
      }
    }
    let entity = await this.userRepository.findOne({
      conditions: { wallet: accountAddress },
    });
    if (!entity) {
      entity = await this.userRepository.create({
        wallet: accountAddress,
      });
    }

    const payload: JwtUser = {
      _id: entity._id.toString(),
      wallet: accountAddress,
    };

    const token = this.jwtService.sign(payload);
    return { token: token, wallet: accountAddress };
  }

  public async isVerifiedKYC(_id: string, wallet: string): Promise<boolean> {
    const conditions = {
      _id: new Types.ObjectId(_id),
      wallet: wallet,
      isVerified: kycStatuses.NEW_REGISTRY,
    };
    const entity = await this.userRepository.findOne({
      conditions: conditions,
    });
    if (entity) {
      const { code, message, status } = Errors.HAD_BEEN_KYC;
      throw new AppException(code, message, status);
    }
    return false;
  }
  /**
   *
   * @param updatedData
   * @param userId
   * @returns
   */
  public async kyc(_id: string, wallet: string, updatedData: Partial<UserDocument>): Promise<any> {
    const conditions = {
      _id: new Types.ObjectId(_id),
      wallet: wallet,
    };
    const options = { new: true };
    const entity = await this.userRepository.findOneAndUpdate(
      conditions,
      { ...updatedData, isVerified: kycStatuses.WAITING_APPROVAL },
      options,
    );
    const userInfo = this.populateUserInfo(entity);
    return userInfo;
  }

  public async getUserInfo(_id: string, wallet: string): Promise<any> {
    const conditions = {
      _id: new Types.ObjectId(_id),
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
      _id: user._id,
      name: user.name,
      wallet: user.wallet,
      phone: user.phone,
      email: user.email,
      address: user.address,
      avatarImage: user.avatarImage,
      selfieImage: user.selfieImage,
      idFrontImage: user.idFrontImage,
      idBackImage: user.idBackImage,
      isVerified: user.isVerified,
      createdAt: (user as any).createdAt,
      updatedAt: (user as any).updatedAt,
    };
    return data;
  }

  public async createUser(wallet: string) {
    let entity = await this.userRepository.findOne({
      conditions: { wallet },
    });
    if (!entity) entity = await this.userRepository.create({ wallet });
    return entity;
  }
}
