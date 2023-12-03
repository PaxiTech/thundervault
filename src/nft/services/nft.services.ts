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
import { get as _get } from 'lodash';
import { ActionDto } from '../dtos/action.dto';
import { CommissionFeeRepository } from '../repositories/commissionfee.repository';
import { CommissionFeeDocument } from '../schemas/commissionfee.schema';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class NftService {
  constructor(
    private nftRepository: NftRepository,
    private commissionFeeRepository: CommissionFeeRepository,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  public async generateNft(
    from: string,
    token: string,
    level: number,
    type?: number,
  ): Promise<any> {
    if (!type) {
      type = Math.floor(Math.random() * 3) + 1;
    }
    const cache_key = `${from}-${level}-${type}`;
    const price = await this.cacheGetKey(cache_key);
    const nftInfo = await this.getNftInfo(token, false);
    const metaData = this.getMetadata(level, type);
    if (nftInfo) {
      return nftInfo;
    } else {
      //lưu nft master
      const nftEntity = await this.nftRepository.create({
        token: token,
        owner: from,
        level: level,
        price: price,
        type: type,
        status: NFT_STATUS.WALLET,
        earningTime: metaData?.earningTime,
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

  public getMetadata(nftLevel: number, type: number) {
    if (metaDataSimple[nftLevel]) {
      return metaDataSimple[nftLevel].find((item) => {
        return item.type === type;
      });
    }
  }
  /**
   * populateNftInfo
   * @param nft {NftDocument}
   * @returns
   */
  public populateNftInfo(nft: NftDocument) {
    const metaData = this.getMetadata(nft.level, nft.type);
    const data = {
      _id: _get(nft, '_id'),
      token: nft.token,
      owner: nft.owner,
      level: nft.level,
      price: nft.price,
      type: nft.type,
      status: nft.status,
      metaData: metaData,
      earningTime: nft.earningTime,
      createdAt: _get(nft, 'createdAt'),
      updatedAt: _get(nft, 'updatedAt'),
    };
    return data;
  }
  async getStoreList(storeListDto: StoreListDto, rate: number) {
    const storeList = { ...metaDataSimple };
    const list = {};
    Object.keys(storeList).map((key) => {
      list[key] = storeList[key]?.map((item) => {
        return {
          name: item.name,
          description: item.description,
          image: item.image,
          type: item.type,
          level: item.level,
          amount: (item.amount * rate).toFixed(2),
          earningTime: item.earningTime,
          status: NFT_STATUS.STORE,
          stock: 10, // sẽ tính số lượng còn lại sau.
        };
      });
    });
    return list;
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

  public async stakingNft(actionDto: ActionDto) {
    const stakingOwnerWallet = this.configService.get<string>('stakingOwnerWallet');
    const { fromWallet, nft, action } = actionDto;
    let nftInfo = await this.getNftInfo(nft);
    let isValidAction = false;
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
      };
      const options = { new: true };
      nftInfo = await this.nftRepository.findOneAndUpdate(conditions, dataUpdate, options);
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

  public async getAvailableCommissionFeeByUser(wallet: string) {
    const totalCommissionFee = await this.getCurrentTotalCommissionFeeByUser(wallet);
    const maxCommissionFee = await this.getMaxValueStakingByUser(wallet);
    return maxCommissionFee - totalCommissionFee;
  }

  //history get commission fee
  public async createCommissionFee(data) {
    return await this.commissionFeeRepository.create(data);
  }
  public async getNftInfoToBuyNft(
    wallet: string,
    level: number,
    type: number,
    rate: number,
  ): Promise<any> {
    const metaData = this.getMetadata(level, type);
    const cache_key = `${wallet}-${level}-${type}`;
    const price = metaData.amount * rate;
    this.cacheSetKey(cache_key, price);
    const toWallet = this.configService.get<string>('nftOwnerWallet');
    const result = {
      toWallet: toWallet,
      amount: price,
      type: type,
      level: level,
      earningTime: metaData.earningTime,
    };
    return result;
  }
  public async cacheGetKey(key: string) {
    return await this.cacheService.get(key);
  }
  public async cacheSetKey(key: string, value: any) {
    await this.cacheService.set(key, value);
  }
  public async cacheDelKey(key: string) {
    await this.cacheService.del(key);
  }
}
