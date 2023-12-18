import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Errors } from '@src/common/contracts/error';
import { PaginateDto } from '@src/common/dtos/paginate.dto';
import { AppException } from '@src/common/exceptions/app.exception';
import { metaDataSimple } from '@src/nft/contracts/meta-data';
import { FilterNftListDto } from '@src/nft/dtos/list.dto';
import { NftListItem } from '@src/nft/dtos/nft-response.dto';
import { NftRepository } from '@src/nft/repositories/nft.repository';
import { NFT_ACTION, NFT_STATUS, NftDocument, STORE_OWNER } from '@src/nft/schemas/nft.schema';
import { StoreListDto } from '@src/store/dtos/list.dto';
import * as fs from 'fs';
import { get as _get, isNull as _isNull } from 'lodash';
import { ActionDto } from '../dtos/action.dto';
import { CommissionFeeRepository } from '../repositories/commissionfee.repository';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UtilHelperService } from '@src/utils/helper.service';
import { UserService } from '@src/user/services/user.services';

@Injectable()
export class NftService {
  constructor(
    private nftRepository: NftRepository,
    private commissionFeeRepository: CommissionFeeRepository,
    private configService: ConfigService,
    private helperService: UtilHelperService,
    private userService: UserService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  public async generateNft(from: string, token: string, level: number): Promise<any> {
    const nftInfo = await this.getNftInfo(token, false);
    const metaData = await this.getMetadata(level);
    if (nftInfo) {
      return nftInfo;
    } else {
      //lưu nft master
      console.log('generate new nft', token);
      const nftEntity = await this.nftRepository.create({
        token: token,
        owner: STORE_OWNER,
        level: level,
        status: NFT_STATUS.STORE,
        amount: metaData?.amount,
        originalStakedDays: metaData?.originalStakedDays ?? 0,
      });
      // tạo file json cho nft
      this.saveNFTAsJson(token, metaData);
      const createNftInfo = this.populateNftInfo(nftEntity);
      return createNftInfo;
    }
  }

  /**
   *
   * @param paginationParam
   * @returns
   */
  async getNftList(filterNftListDto: FilterNftListDto, paginationParam: PaginateDto) {
    const conditions = {};
    const nftList = await this.nftRepository.pagination({
      conditions: conditions,
      ...paginationParam,
      select: ['_id', 'token', 'level', 'owner'],
    });
    const { docs = [], ...pagination } = nftList;
    const result = new NftListItem();
    const list = docs.map((item) => {
      return this.populateNftInfo(item);
    });

    result.docs = list;
    return { ...result, ...pagination };
  }
  private saveNFTAsJson(token: string, metaData: any): void {
    const nftJson = JSON.stringify(metaData);
    const filesDestination = this.configService.get('nft_resource');

    const nftPath = `${filesDestination}${token}.json`;
    //nếu chưa tồn tại file thì tạo file
    if (!fs.existsSync(nftPath)) {
      fs.writeFileSync(nftPath, nftJson);
    }
  }

  public async getNftInfo(token: string, throwError = true): Promise<any> {
    const conditions = {
      token: token,
    };
    const entity = await this.nftRepository.findOne({
      conditions: conditions,
    });
    if (!entity) {
      if (throwError) {
        const { code, message, status } = Errors.NFT_NOT_EXIST;
        throw new AppException(code, message, status);
      } else {
        return null;
      }
    }
    const nftInfo = this.populateNftInfo(entity);
    return nftInfo;
  }

  public getMetadata(nftLevel: number) {
    const nftRank = this.helperService.getNftRankFromLevel(nftLevel);
    if (metaDataSimple[nftRank]) {
      return (
        metaDataSimple[nftRank].find((item) => {
          return parseInt(item.level) == nftLevel;
        }) ?? {}
      );
    } else {
      const { code, message, status } = Errors.META_NOT_EXIST;
      throw new AppException(code, message, status);
    }
  }
  /**
   * populateNftInfo
   * @param nft {NftDocument}
   * @returns
   */
  public populateNftInfo(nft: NftDocument) {
    const metaData = this.getMetadata(nft.level);
    const data = {
      _id: _get(nft, '_id'),
      token: nft.token,
      owner: nft.owner,
      preOwner: nft.preOwner,
      level: nft.level,
      originalStakedDays: nft.originalStakedDays,
      status: nft.status,
      amount: nft.amount,
      stakedDays: nft.stakedDays,
      price: nft.price,
      metaData: metaData,
      chargeTime: nft.chargeTime,
      startTime: nft.startTime,
      createdAt: _get(nft, 'createdAt'),
      updatedAt: _get(nft, 'updatedAt'),
    };
    return data;
  }
  async getStoreList(rate: number): Promise<any> {
    const storeList = { ...metaDataSimple };
    const numOfStock = await this.getStockNft();
    const stockList = numOfStock.reduce((acc, obj) => {
      acc[obj._id] = obj.count;
      return acc;
    }, {});
    const list = {};
    Object.keys(storeList).map((key) => {
      list[key] = storeList[key]?.map((item) => {
        return {
          name: item.name,
          description: item.description,
          image: item.image,
          level: item?.level,
          amount: item.amount,
          price: (item.amount * rate).toFixed(2),
          originalStakedDays: item.originalStakedDays,
          stakedDays: 0,
          remainStakedDays: item.originalStakedDays,
          status: NFT_STATUS.STORE,
          stock: stockList?.[item.level] ?? 0,
        };
      });
    });
    return list;
  }
  public async getDetailStore(level: number, rate: number) {
    const rank = this.helperService.getNftRankFromLevel(level);
    const storeList = await this.getStoreList(rate);
    if (!storeList[rank]) {
      return [];
    }
    const storeNftInfo = storeList[rank].find((item) => {
      return item.level === level;
    });
    const entity = await this.nftRepository.findOne({
      conditions: {
        level: level,
        status: NFT_STATUS.STORE,
      },
    });
    if (!_isNull(entity)) {
      const masterNftInfo = this.populateNftInfo(entity);
      storeNftInfo['token'] = masterNftInfo.token;
    } else {
      storeNftInfo['stock'] = 0;
    }
    return storeNftInfo;
  }
  async getListNftByUser(wallet: string, status: number, paginationParam: PaginateDto) {
    const conditions = { owner: wallet };
    if (status) {
      conditions['status'] = status;
    }
    const nftList = await this.nftRepository.pagination({
      conditions: conditions,
      ...paginationParam,
    });
    const { docs = [], ...pagination } = nftList;
    const result = new NftListItem();
    const list = docs.map((item) => {
      return this.populateNftInfo(item);
    });

    result.docs = list;
    return { ...result, ...pagination };
  }
  /**
   *
   * @param paginationParam
   * @returns
   */
  async getListNftByStatus(
    status: number,
    storeListDto: StoreListDto,
    paginationParam: PaginateDto,
  ) {
    let keywordConds: Record<any, any> = {};
    let conditions = { status: status };

    if (storeListDto.keyword) {
      keywordConds = {
        $or: [
          // { name: { $regex: params.keyword, $options: 'i' } },
          // { 'table.name': { $regex: storeListDto.keyword, $options: 'i' } },
        ],
      };
    }

    conditions = { ...keywordConds, ...conditions };
    const nftList = await this.nftRepository.pagination({
      conditions: conditions,
      ...paginationParam,
    });
    const { docs = [], ...pagination } = nftList;
    const result = new NftListItem();
    const list = docs.map((item) => {
      return this.populateNftInfo(item);
    });

    result.docs = list;
    return { ...result, ...pagination };
  }

  public async stakingNft(actionDto: ActionDto, data = {}) {
    const stakingOwnerWallet = this.configService.get<string>('stakingOwnerWallet');
    const { fromWallet, nft, action } = actionDto;
    let nftInfo = await this.getNftInfo(nft);
    let isValidAction = false;
    console.log(`start staking. wallet : ${fromWallet}, nft: ${nft}`);
    //staking action
    if (
      action === NFT_ACTION.staking &&
      nftInfo.status === NFT_STATUS.WALLET &&
      nftInfo.owner === fromWallet
    ) {
      isValidAction = true;
    }
    if (!isValidAction) {
      const { code, message, status } = Errors.INVALID_STAKING_OWNER_NFT;
      throw new AppException(code, message, status);
    }
    if (nftInfo && isValidAction) {
      const conditions = { token: nft };
      const dataUpdate = {
        owner: stakingOwnerWallet,
        preOwner: nftInfo.owner,
        status: NFT_STATUS.STAKING,
        ...data,
      };
      const options = { new: true };
      nftInfo = await this.nftRepository.findOneAndUpdate(conditions, dataUpdate, options);
      console.log(`finish staking. wallet : ${fromWallet}, nft: ${nft}`);
      return this.populateNftInfo(nftInfo);
    }
  }

  public async unStakingNft(actionDto: ActionDto, data = {}) {
    const stakingOwnerWallet = this.configService.get<string>('stakingOwnerWallet');
    const { fromWallet, nft, action } = actionDto;
    console.log(`start unstaking. wallet : ${fromWallet}, nft: ${nft}`);
    let nftInfo = await this.getNftInfo(nft);
    let isValidAction = false;
    //unStaking action
    if (
      action === NFT_ACTION.unStaking &&
      nftInfo.status === NFT_STATUS.STAKING &&
      nftInfo.owner === stakingOwnerWallet &&
      nftInfo.preOwner === fromWallet
    ) {
      isValidAction = true;
    }
    if (!isValidAction) {
      const { code, message, status } = Errors.INVALID_STAKING_OWNER_NFT;
      throw new AppException(code, message, status);
    }
    if (nftInfo && isValidAction) {
      const conditions = { token: nft };
      const dataUpdate = {
        owner: fromWallet,
        preOwner: '',
        status: NFT_STATUS.WALLET,
        ...data,
      };
      const options = { new: true };
      nftInfo = await this.nftRepository.findOneAndUpdate(conditions, dataUpdate, options);

      //tìm level cao nhất của user hiện tại sau khi unstaking
      const maxCurrentStakingLevel = await this.getMaxCurrentStakingLevelByUser(fromWallet);
      const tokenLevel =
        maxCurrentStakingLevel === 0 ? 0 : this.helperService.getNftRankFromLevel(nftInfo.level);
      //cập nhập lại level cho user sau khi unstaking
      await this.userService.updateUserLevel(fromWallet, tokenLevel);
      console.log(`finish unstaking. wallet : ${fromWallet}, nft: ${nft}`);
      return this.populateNftInfo(nftInfo);
    }
  }

  public async addNftToMarket(actionDto: ActionDto) {
    const marketOwnerWallet = this.configService.get<string>('marketOwnerWallet');
    const { fromWallet, nft, action } = actionDto;
    let nftInfo = await this.getNftInfo(nft);
    let isValidAction = false;
    //staking action
    if (
      action === NFT_ACTION.market &&
      nftInfo.status === NFT_STATUS.WALLET &&
      nftInfo.owner === fromWallet
    ) {
      isValidAction = true;
    }
    if (!isValidAction) {
      const { code, message, status } = Errors.INVALID_STAKING_OWNER_NFT;
      throw new AppException(code, message, status);
    }
    if (nftInfo && isValidAction) {
      const conditions = { token: nft };
      const dataUpdate = {
        owner: marketOwnerWallet,
        preOwner: nftInfo.owner,
        status: NFT_STATUS.MARKET,
      };
      const options = { new: true };
      nftInfo = await this.nftRepository.findOneAndUpdate(conditions, dataUpdate, options);
      return this.populateNftInfo(nftInfo);
    }
  }

  public async buyNftFromStore(actionDto: ActionDto) {
    const { fromWallet, nft, action } = actionDto;
    let nftInfo = await this.getNftInfo(nft);
    //check action
    let isValidAction = false;
    //buy action, action : buy from store, current status store => update status wallet
    if (
      action === NFT_ACTION.buy &&
      nftInfo.status === NFT_STATUS.STORE &&
      nftInfo.owner === STORE_OWNER
    ) {
      isValidAction = true;
    }
    if (!isValidAction) {
      const { code, message, status } = Errors.INVALID_BUY_NFT;
      throw new AppException(code, message, status);
    }
    if (nftInfo && isValidAction) {
      const conditions = { token: nft };
      const dataUpdate = { owner: fromWallet, preOwner: '', status: NFT_STATUS.WALLET };
      const options = { new: true };
      nftInfo = await this.nftRepository.findOneAndUpdate(conditions, dataUpdate, options);
      return this.populateNftInfo(nftInfo);
    }
  }

  public async buyNftFromMarket(actionDto: ActionDto) {
    const { fromWallet, nft, action } = actionDto;
    let nftInfo = await this.getNftInfo(nft);
    //check action
    let isValidAction = false;
    //buy action, action : buy from store, current status store => update status wallet
    //buy action, action : buy from market, current status market => update status wallet
    if (action === NFT_ACTION.buy && nftInfo.status === NFT_STATUS.MARKET) {
      isValidAction = true;
    }
    if (!isValidAction) {
      const { code, message, status } = Errors.INVALID_BUY_NFT;
      throw new AppException(code, message, status);
    }
    if (nftInfo && isValidAction) {
      const conditions = { token: nft };
      const dataUpdate = { owner: fromWallet, preOwner: '', status: NFT_STATUS.WALLET };
      const options = { new: true };
      nftInfo = await this.nftRepository.findOneAndUpdate(conditions, dataUpdate, options);
      return this.populateNftInfo(nftInfo);
    }
  }

  async getNftByUser(wallet: string) {
    const conditions = { owner: wallet };
    const nftList = await this.nftRepository.find({ conditions: conditions });
    const list = nftList.map((item) => {
      return this.populateNftInfo(item);
    });
    return list;
  }

  //tổng số tiền tối đa user có thể nhân là 4 lần tổng giá trị nft mà user đó đang staking
  public async getMaxValueStakingByUser(wallet: string) {
    const totalAmount = await this.nftRepository.getTotalNftStakingByUser(wallet);
    return totalAmount * 4; // 4 lần tổng giá trị staking
  }

  public async getCurrentTotalCommissionFeeByUser(wallet: string) {
    return await this.commissionFeeRepository.getTotalCommissionFeeStakingByUser(wallet);
  }

  public async getCurrentTotalCommissionFeeSystem() {
    return await this.commissionFeeRepository.getCurrentTotalCommissionFeeSystem();
  }

  public async getAvailableCommissionFeeByUser(wallet: string) {
    const totalCommissionFee = await this.getCurrentTotalCommissionFeeByUser(wallet);
    const maxCommissionFee = await this.getMaxValueStakingByUser(wallet);
    return maxCommissionFee - totalCommissionFee;
  }

  //history get commission fee
  public async createCommissionFee(data) {
    return await this.commissionFeeRepository.create(data);
  }
  public async getNftInfoToBuyNft(wallet: string, level: number, rate: number): Promise<any> {
    const metaData = this.getMetadata(level);
    const cache_key = `${wallet}-${level}`;
    const price = metaData.amount * rate;
    this.cacheSetKey(cache_key, price);
    const toWallet = this.configService.get<string>('nftOwnerWallet');
    // cần gọi api kiểm stra xem còn nft loại này trong store không nếu mà có kiểm soát số lượng nft tối đa
    const conditions = {
      owner: STORE_OWNER,
      level: level,
      status: NFT_STATUS.STORE,
    };
    const entity = await this.nftRepository.findOne({
      conditions: conditions,
    });
    // tạm thời bỏ check
    // if (!entity) {
    //   const { code, message, status } = Errors.NFT_OUT_OF_STOCK;
    //   throw new AppException(code, message, status);
    // }
    const result = {
      toWallet: toWallet,
      amount: price,
      level: level,
      originalStakedDays: metaData.originalStakedDays,
    };
    return result;
  }
  public async cacheGetKey(key: string): Promise<any> {
    return await this.cacheService.get(key);
  }
  public async cacheSetKey(key: string, value: any) {
    await this.cacheService.set(key, value);
  }
  public async cacheDelKey(key: string) {
    await this.cacheService.del(key);
  }
  public async updateNftOwner(nft: string, owner: string, status?: number, price?: number) {
    const conditions = { token: nft };
    const dataUpdate = { owner: owner };
    if (status) {
      dataUpdate['status'] = status;
    }
    if (price) {
      dataUpdate['price'] = price;
    }
    const options = { new: true };
    await this.nftRepository.findOneAndUpdate(conditions, dataUpdate, options);
  }

  public async updateNft(nft: string, owner: string, dataUpdate = {}) {
    const conditions = { token: nft, owner: owner };
    const options = { new: true };
    await this.nftRepository.findOneAndUpdate(conditions, dataUpdate, options);
  }

  public async countNftStakedByUser(wallet: string) {
    return await this.nftRepository.countNftStakedByUser(wallet);
  }
  public async countAllNftStaked() {
    return await this.nftRepository.countAllNftStaked();
  }

  public async getStockNft() {
    return await this.nftRepository.getStockNft();
  }

  async getAllNftStaking(): Promise<any> {
    const conditions = { status: NFT_STATUS.STAKING };
    const nftList = await this.nftRepository.find({
      conditions: conditions,
    });
    const list = nftList.map((item) => {
      return this.populateNftInfo(item);
    });

    return list;
  }

  public async validateNftStaking(wallet: string, token: string): Promise<any> {
    const toWallet = this.configService.get<string>('stakingOwnerWallet');
    const nftInfo = await this.getNftInfo(token);
    if (nftInfo.owner !== wallet) {
      const { code, message, status } = Errors.INVALID_STAKING_OWNER_NFT;
      throw new AppException(code, message, status);
    }
    if (nftInfo.status !== NFT_STATUS.WALLET) {
      const { code, message, status } = Errors.INVALID_STAKING_NFT;
      throw new AppException(code, message, status);
    }
    const result = {
      toWallet: toWallet,
      token: token,
    };
    return result;
  }

  public async getMaxCurrentStakingLevelByUser(wallet: string) {
    const conditions = { owner: wallet, status: NFT_STATUS.STAKING };
    const entity = await this.nftRepository.findOne({
      conditions: conditions,
      options: { sort: { level: -1 } },
    });
    if (!entity) {
      return entity.level;
    }
    return 0;
  }
}
