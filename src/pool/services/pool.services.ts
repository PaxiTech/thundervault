import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PoolRepository } from '@src/pool/repositories/pool.repository';
import { PoolStakingRepository } from '@src/pool/repositories/pool.staking.repository';
import { PoolDocument } from '@src/pool/schemas/pool.schema';
import { UserService } from '@src/user/services/user.services';
import { UtilHelperService } from '@src/utils/helper.service';
import { get as _get, isEmpty as _isEmpty } from 'lodash';
import { NftService } from '@src/nft/services/nft.services';
import { UserItem } from '@src/user/dtos/user-response.dto';
import { IPool } from '../interfaces/pool.interface';

import {
  directFeeConfig,
  totalDirectFeeConfig,
  stakingFeeConfig,
  totalStakingFeeConfig,
} from '@src/pool/contracts/pool-config';
import { COMMISSION_TYPE } from '@src/nft/schemas/commissionfee.schema';

@Injectable()
export class PoolService {
  constructor(
    private poolRepository: PoolRepository,
    private poolStakingRepository: PoolStakingRepository,
    private configService: ConfigService,
    private helperService: UtilHelperService,
    private userService: UserService,
    private nftService: NftService,
  ) {}

  /**
   * populatePoolInfo
   * @param pool {PoolDocument}
   * @returns
   */
  public populatePoolInfo(pool: PoolDocument) {
    const data = {
      _id: _get(pool, '_id'),
      from: pool?.from,
      to: pool?.to,
      nft: pool?.nft,
      level: pool?.level,
      createdAt: _get(pool, 'createdAt'),
      updatedAt: _get(pool, 'updatedAt'),
    };
    return data;
  }
  public async staking(stakingData: IPool): Promise<any> {
    const { from } = stakingData;
    const userInfo = await this.userService.getUserInfo(from, { getRefCode: true });
    const refCode = userInfo.refCode;
    // const nftInfo = await this.nftService.getNftInfo(nft);
    const createData = {
      ...stakingData,
    };
    const poolEntity = await this.poolRepository.create(createData);
    const poolInfo = this.populatePoolInfo(poolEntity);
    //if có pref, tìm user được ref đến.
    if (refCode) {
      const parentUserInfo = await this.userService.getUserInfoByMyRefCode(refCode);
      await this.userService.processMyRefCode(from, parentUserInfo.wallet);
    }
    await this.processDirectCommissionFeeSystem(from, stakingData.nft, stakingData.price);
    await this.processReferralDirect(stakingData, userInfo);
    return poolInfo;
  }

  public async processReferralDirect(stakingData: IPool, UserInfo: UserItem) {
    const { from, nft, price } = stakingData;
    const tokenLevel = stakingData.level;
    const wallet = UserInfo.wallet;
    //update user level if sử dụng user level = nft level
    await this.userService.updateUserLevel(wallet, tokenLevel);
    const {
      refLevel1,
      refLevel2,
      refLevel3,
      refLevel4,
      refLevel5,
      refLevel6,
      refLevel7,
      refLevel8,
    } = UserInfo;
    //condition referral direct
    let nftCommissionFee = price * totalDirectFeeConfig;

    const totalSystemCommissionFee = this.configService.get<number>('totalSystemCommissionFee');
    // lấy tổng số tiền đã trả cho staking
    const currentTotalCommissionFeeSystem =
      await this.nftService.getCurrentTotalCommissionFeeSystem();
    // tính tổng số tiền còn lại của quỹ staking
    const commissionFeeRemain = totalSystemCommissionFee - currentTotalCommissionFeeSystem;
    nftCommissionFee =
      commissionFeeRemain > nftCommissionFee ? nftCommissionFee : commissionFeeRemain;
    // xử lý ref level
    const allRefUserList = [
      refLevel1,
      refLevel2,
      refLevel3,
      refLevel4,
      refLevel5,
      refLevel6,
      refLevel7,
      refLevel8,
    ];
    allRefUserList.filter((e) => {
      return !_isEmpty(e);
    });
    //cal direct commission fee
    for (let i = 0; i < allRefUserList.length; i++) {
      const userRefId = allRefUserList[i]; //user id ứng với ref level
      const refLevel = i; //relevel
      const refConfigKey = `F${i}`; //key config
      console.log('userRefId', userRefId);
      console.log('refLevel', refLevel);
      console.log('refConfigKey', refConfigKey);
      nftCommissionFee = await this.processDirectCommissionFeeByLevel({
        from: from,
        userWallet: userRefId,
        nft: nft,
        price: price,
        nftCommissionFee: nftCommissionFee,
        level: refLevel,
        configRelLevel: refConfigKey,
        type: COMMISSION_TYPE.DIRECT,
      });
    }
    // add rest direct commission fee to f0wallet
    if (nftCommissionFee > 0) {
      await this.processRestCommissionFeeSystem(
        from,
        nft,
        price,
        nftCommissionFee,
        COMMISSION_TYPE.DIRECT,
      );
    }
    //cal staking commission fee
    let nftStakingCommissionFee = price * totalStakingFeeConfig;
    for (let i = 0; i < allRefUserList.length; i++) {
      const userRefId = allRefUserList[i]; //user id ứng với ref level
      const refLevel = i; //relevel
      const refConfigKey = `F${i}`; //key config
      console.log('userRefId', userRefId);
      console.log('refLevel', refLevel);
      console.log('refConfigKey', refConfigKey);
      nftStakingCommissionFee = await this.processStakingCommissionFeeByLevel({
        from: from,
        userWallet: userRefId,
        nft: nft,
        price: price,
        nftCommissionFee: nftStakingCommissionFee,
        level: refLevel,
        configRelLevel: refConfigKey,
        type: COMMISSION_TYPE.STAKING,
      });
    }

    //add rest staking commission fee to f0wallet
    if (nftStakingCommissionFee > 0) {
      await this.processRestCommissionFeeSystem(
        from,
        nft,
        price,
        nftStakingCommissionFee,
        COMMISSION_TYPE.STAKING,
      );
    }
  }

  public async validateStaking(wallet: string, level: number) {
    const totalCondition1 = 5;
    const totalCondition2 = 3;
    // const queryLevel = level - 1 >= 0 ? level - 1 : 0;
    const queryLevel = level - 1;
    const allUserListF1 = await this.poolRepository.find({ conditions: { from: wallet } });
    const totalUserListF1 = allUserListF1?.length ?? 0;

    const allUserListF1AndLevel = await this.poolRepository.find({
      conditions: { from: wallet, level: queryLevel },
    });

    const totalUserListF1AndLevel = allUserListF1AndLevel?.length ?? 0;
    if (totalUserListF1 >= totalCondition1 && totalUserListF1AndLevel >= totalCondition2) {
      return true;
    }
    return false;
  }

  public async processDirectCommissionFeeByLevel({
    from,
    userWallet,
    nft,
    price,
    nftCommissionFee,
    level,
    configRelLevel,
    type,
  }) {
    //lấy thông tin F1
    const userInfo = await this.userService.getUserInfo(userWallet);
    const maxValueCommissionFeeAvailable = await this.nftService.getAvailableCommissionFeeByUser(
      userInfo.wallet,
    );
    // chỉ xử lý khi còn có thể nhận được commission fee
    if (maxValueCommissionFeeAvailable > 0) {
      // lấy giá trị config cho từng level ref.
      const directFeeConfigByLevel = directFeeConfig[configRelLevel][userInfo.level];
      // tính ra số tiền hoa hồng nhận được.
      let earningValue = this.helperService.calculateEarningValue(price, directFeeConfigByLevel);
      nftCommissionFee = nftCommissionFee - earningValue;
      earningValue =
        nftCommissionFee - earningValue > 0 ? earningValue : nftCommissionFee - earningValue;
      const commissionFee = {
        from: from,
        owner: userInfo.wallet,
        token: nft,
        price: price,
        amountFee: earningValue,
        refLevel: level,
        type: type,
      };
      await this.nftService.createCommissionFee(commissionFee);
    }
    return nftCommissionFee;
  }

  public async processStakingCommissionFeeByLevel({
    from,
    userWallet,
    nft,
    price,
    nftCommissionFee,
    level,
    configRelLevel,
    type,
  }) {
    //lấy thông tin F1
    const userInfo = await this.userService.getUserInfo(userWallet);
    const maxValueCommissionFeeAvailable = await this.nftService.getAvailableCommissionFeeByUser(
      userInfo.wallet,
    );
    // kiểm tra điều kiện có ít nhất 5 F1 staking và có 3 F1 hạng thấp hơn 1 bậc.
    const isValidStakingF1 = await this.validateStaking(userInfo.wallet, userInfo.level);
    if (isValidStakingF1 && maxValueCommissionFeeAvailable > 0) {
      // lấy giá trị config cho từng level ref.
      const stakingFeeConfigByLevel = stakingFeeConfig[configRelLevel][userInfo.level];
      // tính ra số tiền hoa hồng nhận được.
      let earningValue = this.helperService.calculateEarningValue(price, stakingFeeConfigByLevel);
      nftCommissionFee = nftCommissionFee - earningValue;
      earningValue =
        nftCommissionFee - earningValue > 0 ? earningValue : nftCommissionFee - earningValue;
      const commissionFee = {
        from: from,
        owner: userInfo.wallet,
        token: nft,
        price: price,
        amountFee: earningValue,
        refLevel: level,
        type: type,
      };
      await this.nftService.createCommissionFee(commissionFee);
    }
    return nftCommissionFee;
  }

  /**
   * tính tiền hoa hồng trả trực tiếp cho system.
   * @param from
   * @param nft
   * @param price
   * @returns
   */
  public async processDirectCommissionFeeSystem(from: string, nft: string, price: number) {
    const commissionFee = price * totalDirectFeeConfig;
    const systemWallet = this.configService.get<string>('systemWallet');
    // lấy tổng số tiền quỹ cấu hình cho chức năng staking
    const totalSystemCommissionFee = this.configService.get<number>('totalSystemCommissionFee');
    // lấy tổng số tiền đã trả cho staking
    const currentTotalCommissionFeeSystem =
      await this.nftService.getCurrentTotalCommissionFeeSystem();
    // tính tổng số tiền còn lại của quỹ staking
    const commissionFeeRemain = totalSystemCommissionFee - currentTotalCommissionFeeSystem;
    // kiểm tra giá trị có thể nhận.
    const earningValue = commissionFeeRemain > commissionFee ? commissionFee : commissionFeeRemain;
    const commissionFeeData = {
      from: from,
      owner: systemWallet,
      token: nft,
      price: price,
      amountFee: earningValue,
      refLevel: 0, // nhận trực tiếp
      type: COMMISSION_TYPE.DIRECT, // nhận trực tiếp
    };

    const directCommissionFee = await this.nftService.createCommissionFee(commissionFeeData);
    return directCommissionFee;
  }
  /**
   * tính tổng số tiền còn dư nếu user không có ref
   * @param from
   * @param nft
   * @param price
   * @param commissionFee
   * @returns
   */
  public async processRestCommissionFeeSystem(
    from: string,
    nft: string,
    price: number,
    commissionFee: number,
    type: string,
  ) {
    const f0Wallet = this.configService.get<string>('f0Wallet');
    // lấy tổng số tiền quỹ cấu hình cho chức năng staking
    const totalSystemCommissionFee = this.configService.get<number>('totalSystemCommissionFee');
    // lấy tổng số tiền đã trả cho staking
    const currentTotalCommissionFeeSystem =
      await this.nftService.getCurrentTotalCommissionFeeSystem();
    // tính tổng số tiền còn lại của quỹ staking
    const commissionFeeRemain = totalSystemCommissionFee - currentTotalCommissionFeeSystem;
    // kiểm tra giá trị có thể nhận.
    const earningValue = commissionFeeRemain > commissionFee ? commissionFee : commissionFeeRemain;
    const commissionFeeData = {
      from: from,
      owner: f0Wallet,
      token: nft,
      price: price,
      amountFee: earningValue,
      refLevel: 0, // nhận trực tiếp
      type: type,
    };

    const directCommissionFee = await this.nftService.createCommissionFee(commissionFeeData);
    return directCommissionFee;
  }
}
