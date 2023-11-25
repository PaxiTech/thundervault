import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PoolRepository } from '@src/pool/repositories/pool.repository';
import { PoolStakingRepository } from '@src/pool/repositories/pool.staking.repository';
import { PoolDocument } from '@src/pool/schemas/pool.schema';
import { UserService } from '@src/user/services/user.services';
import { UtilHelperService } from '@src/utils/helper.service';
import { get as _get } from 'lodash';
import { NftService } from '@src/nft/services/nft.services';
import { UserItem } from '@src/user/dtos/user-response.dto';
import { IPool } from '../interfaces/pool.interface';
import { brokerageFeeStaking } from '@src/pool/contracts/pool-config';

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
    await this.processReferralStaking(stakingData, userInfo);
    return poolInfo;
  }

  public async processReferralStaking(stakingData: IPool, UserInfo: UserItem) {
    const { from, nft } = stakingData;
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
    //condition referral Staking
    // xử lý ref F1
    if (refLevel1) {
      //lấy thông tin F1
      const userF1 = await this.userService.getUserInfo(refLevel1);
      // kiểm tra điều kiện có ít nhất 5 F1 staking và có 3 F1 hạng thấp hơn 1 bậc.
      const isValidStakingF1 = await this.validateStaking(userF1.wallet, userF1.level);
      if (isValidStakingF1) {
        const currentBrokerageFeeStaking = brokerageFeeStaking['F1'];
        const earningValue = this.helperService.calculateEarningValue(
          stakingData.price,
          currentBrokerageFeeStaking,
        );
        const poolStakingData = {
          from: from,
          nft: nft,
          refLevel: 1,
          earningValue: earningValue,
        };
        const poolStakingEntiy = await this.poolStakingRepository.create(poolStakingData);
      }
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
}
