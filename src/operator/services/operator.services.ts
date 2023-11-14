import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Errors } from '@src/common/contracts/error';
import { AppException } from '@src/common/exceptions/app.exception';
import { JwtOperator } from '@src/operator/interfaces/operator-service.interface';
import { OperatorRepository } from '@src/operator/repositories/operator.repository';
import { ConfigService } from '@nestjs/config';
import { OperatorDocument, statuses } from '@src/operator/schemas/operator.schema';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
@Injectable()
export class OperatorService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private operatorRepository: OperatorRepository,
  ) {}

  /**
   * login operator
   *
   * @param {<{ email, password }>} data
   * @returns Promise<Record<string, any>>
   */
  public async loginOperator({ email, password }) {
    const entity = await this.operatorRepository.firstOrFail({
      conditions: {
        email: email,
      },
      error: Errors.ACCOUNT_NOT_EXIST,
    });

    if (entity.status !== statuses.ACTIVE) {
      const { code, message, status } = Errors.ACCOUNT_IS_NOT_ACTIVE;
      throw new AppException(code, message, status);
    }

    const isValidPassword = await bcrypt.compare(password, entity.password);
    if (isValidPassword) {
      const payload: JwtOperator = {
        _id: entity._id.toString(),
      };

      const token = this.jwtService.sign(payload);
      return { token: token, email: entity.email, fullName: entity.fullName };
    }
    const { code, message, status } = Errors.INVALID_PASSWORD;
    throw new AppException(code, message, status);
  }

  public async getOperatorInfo(_id: string): Promise<any> {
    const conditions = {
      _id: new Types.ObjectId(_id),
    };
    const entity = await this.operatorRepository.findOne({
      conditions: conditions,
    });
    if (!entity) {
      const { code, message, status } = Errors.ACCOUNT_NOT_EXIST;
      throw new AppException(code, message, status);
    }
    const operatorInfo = this.populateOperatorInfo(entity);
    return operatorInfo;
  }
  /**
   * populateOperatorInfo
   * @param operator {OperatorDocument}
   * @returns
   */
  public populateOperatorInfo(operator: OperatorDocument) {
    const data = {
      _id: operator._id,
      email: operator.email,
      fullName: operator.fullName,
      createdAt: (operator as any).createdAt,
      updatedAt: (operator as any).updatedAt,
    };
    return data;
  }

  public async createSeedOperator({ email, password, fullName }) {
    const isExistEmail = await this.isExistEmail(email);
    if (isExistEmail) {
      const { code, message, status } = Errors.ACCOUNT_NOT_EXIST;
      throw new AppException(code, message, status);
    }
    const operator = await this.operatorRepository.create({
      email: email,
      password: password,
      fullName: fullName,
      status: statuses.ACTIVE,
    });
    return this.populateOperatorInfo(operator);
  }

  public async isExistEmail(email: string): Promise<boolean> {
    const conditions = {
      email: email,
    };
    const entity = await this.operatorRepository.findOne({
      conditions: conditions,
    });
    if (entity) {
      return true;
    }
    return false;
  }
  /**
   *
   * @param updatedData
   * @param operatorId
   * @returns
   */
  public async update(operatorId: string, updatedData: Partial<OperatorDocument>) {
    if (updatedData.password) {
      const password = await bcrypt.hash(updatedData.password, 10);
      updatedData.password = password;
    }
    const conditions = { _id: operatorId };
    const options = { new: true };
    const entity = await this.operatorRepository.findOneAndUpdate(conditions, updatedData, options);
    const userInfo = this.populateOperatorInfo(entity);
    return userInfo;
  }
}
