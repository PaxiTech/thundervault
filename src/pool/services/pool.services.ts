import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StakingDto } from '@src/pool/dtos/staking.dto';
import { PoolRepository } from '@src/pool/repositories/pool.repository';
import { PoolDocument } from '@src/pool/schemas/pool.schema';
import { UserService } from '@src/user/services/user.services';
import { UtilHelperService } from '@src/utils/helper.service';
import { get as _get } from 'lodash';
import { NftService } from '@src/nft/services/nft.services';
import { UserDocument } from '@src/user/schemas/user.schema';

@Injectable()
export class PoolService {
  constructor(
    private poolRepository: PoolRepository,
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
      level: pool?.level,
      from: pool?.from,
      to: pool?.to,
      createTime: pool?.createTime,
      createdAt: _get(pool, 'createdAt'),
      updatedAt: _get(pool, 'updatedAt'),
    };
    return data;
  }
  public async staking(stakingDto: StakingDto): Promise<any> {
    const { from, to, token } = stakingDto;
    const userInfo = await this.userService.getUserInfo(from, { getReferralCode: true });
    const nftInfo = await this.nftService.getNftInfo(token);
    await this.calReferralStaking(nftInfo.level, userInfo);
    const poolEntity = await this.poolRepository.create(stakingDto);
    const poolInfo = this.populatePoolInfo(poolEntity);
    return poolInfo;
  }

  public async calReferralStaking(tokenLevel: number, UserInfo: any) {
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
  }
}
