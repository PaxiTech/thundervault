import { Injectable, Type } from '@nestjs/common';
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
import * as moment from 'moment';

import {
  directFeeConfig,
  totalDirectFeeConfig,
  stakingFeeConfig,
  totalStakingFeeConfig,
  stakingFeePerDay,
} from '@src/pool/contracts/pool-config';
import { COMMISSION_TYPE } from '@src/nft/schemas/commissionfee.schema';
import { PoolInfo } from '../dtos/pool-response.dto';
import { NftItem } from '@src/nft/dtos/nft-response.dto';
import { NFT_STATUS } from '@src/nft/schemas/nft.schema';

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
      type: pool?.type,
      price: pool?.price,
      startTime: pool?.startTime,
      chargeTime: pool?.chargeTime,
      transactionHash: pool?.transactionHash,
      createdAt: _get(pool, 'createdAt'),
      updatedAt: _get(pool, 'updatedAt'),
    };
    return data;
  }
  public async processStaking(stakingData: IPool): Promise<any> {
    const { from, nft } = stakingData;
    //chuyển đổi từ level nft sang level user.
    const tokenLevel = this.helperService.getNftRankFromLevel(stakingData.level);
    //set user level theo nft level
    await this.userService.updateUserLevel(from, tokenLevel);

    const userInfo = await this.userService.getUserInfo(from, { getRefCode: true });
    const nftInfo = await this.nftService.getNftInfo(nft);
    const refCode = userInfo.refCode;
    //pool là history của staking
    const createData = {
      ...stakingData,
      level: nftInfo.level,
      type: nftInfo.type,
      price: nftInfo.price,
    };
    const poolEntity = await this.poolRepository.create(createData);
    const poolInfo = this.populatePoolInfo(poolEntity);
    //if có pref, tìm user được ref đến.
    if (refCode) {
      const parentUserInfo = await this.userService.getUserInfoByMyRefCode(refCode);
      await this.userService.processMyRefCode(from, parentUserInfo.wallet);
    }
    await this.processDirectCommissionFeeSystem(from, stakingData.nft, stakingData.price);
    await this.processUserCommissionFee(stakingData, userInfo);
    return poolInfo;
  }

  /**
   * xử lý staking
   * @param stakingData
   * @param UserInfo
   */
  public async processUserCommissionFee(stakingData: IPool, UserInfo: UserItem) {
    const { from, nft, price } = stakingData;
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

  /**
   * Tính hoa hồng trực tiếp
   * @param param
   * @returns
   */
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

  /**
   * tính hoa hồng staking
   * @param param
   * @returns
   */
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

  public async poolInfo(wallet: string) {
    // lấy tổng số tiền quỹ cấu hình cho chức năng staking
    // const totalSystemCommissionFee = this.configService.get<number>('totalSystemCommissionFee');
    // lấy tổng số tiền đã trả cho staking
    const currentTotalCommissionFeeSystem =
      await this.nftService.getCurrentTotalCommissionFeeSystem();
    // tính tổng số tiền còn lại của quỹ staking
    // const remainCommissionFee = totalSystemCommissionFee - currentTotalCommissionFeeSystem;
    const totalNftStaked = await this.nftService.countAllNftStaked();
    const data = {
      // totalSystemCommissionFee: totalSystemCommissionFee,
      // remainCommissionFee: remainCommissionFee,
      currentTotalCommissionFeeSystem: currentTotalCommissionFeeSystem,
      totalNftStaked: totalNftStaked,
    };
    if (wallet) {
      const myCommissionFee = await this.nftService.getCurrentTotalCommissionFeeByUser(wallet);
      const myTotalNftStaked = await this.nftService.countNftStakedByUser(wallet);
      const allNftStaked = await this.nftService.getAllNftByUser(wallet, NFT_STATUS.STAKING);
      const userPoolInfo = {
        myCommissionFee: myCommissionFee,
        myTotalNftStaked: myTotalNftStaked,
        nft: allNftStaked ?? [],
      };
      data['userInfo'] = userPoolInfo;
    }

    return data;
  }

  public async processCommissionFeeEveryDay() {
    const listNftStaked = await this.getListNftCanReceiveCommissionFeeEveryDay();
    if (_isEmpty(listNftStaked)) {
      return [];
    }
    listNftStaked.forEach(async (item) => {
      await this.processCommissionFeeEveryDayByUser(item);
    });
  }
  public async getListNftCanReceiveCommissionFeeEveryDay() {
    const nfts = await this.nftService.getAllNftStaking();
    const currentTime = moment().startOf('day').toDate();
    // Lọc danh sách user dựa trên startTime
    const filterNftList = nfts.filter((item) => {
      const startTime = moment(item.startTime);
      const hoursDiff = startTime.diff(currentTime, 'hours');
      return hoursDiff >= 24;
    });

    return filterNftList;
  }

  public async processCommissionFeeEveryDayByUser(nftInfo: NftItem) {
    if (!nftInfo.preOwner) {
      return;
    }
    const { token, price, preOwner, stakedDays } = nftInfo;
    //lấy thông tin F1
    const userInfo = await this.userService.getUserInfo(nftInfo.preOwner);
    const maxValueCommissionFeeAvailable = await this.nftService.getAvailableCommissionFeeByUser(
      userInfo.wallet,
    );
    // chỉ xử lý khi còn có thể nhận được commission fee
    if (maxValueCommissionFeeAvailable > 0 && stakedDays > 1) {
      // lấy giá trị config cho từng level ref.

      // tính ra số tiền hoa hồng nhận được.
      const staking_fee_per_day = stakingFeePerDay[userInfo.level];
      let earningValue = this.helperService.calculateEarningValue(price, staking_fee_per_day);
      earningValue =
        maxValueCommissionFeeAvailable - earningValue > 0
          ? earningValue
          : maxValueCommissionFeeAvailable - earningValue;
      const commissionFee = {
        from: userInfo.wallet, //kiếm tiền từ chính nó.
        owner: userInfo.wallet,
        token: token,
        price: price,
        amountFee: earningValue,
        refLevel: 0, // nhận trực tiếp
        type: COMMISSION_TYPE.STAKING_DAY,
      };
      await this.nftService.createCommissionFee(commissionFee);
      // update nft info and nft pool info
      const currentTime = moment().startOf('day').toDate();
      const updateData = {
        startTime: currentTime,
        chargeTime: currentTime,
        stakedDate: stakedDays - 1,
      };
      const nftInfo = await this.nftService.updateNft(token, preOwner, updateData);
    }
  }
}
