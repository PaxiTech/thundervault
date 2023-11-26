import { Injectable } from '@nestjs/common';
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

@Injectable()
export class NftService {
  constructor(private nftRepository: NftRepository, private configService: ConfigService) {}

  public async generateNft(token: string, level: number): Promise<any> {
    const nftInfo = await this.getNftInfo(token, false);
    const metaData = this.getMetadata(level);
    if (nftInfo) {
      return nftInfo;
    } else {
      //lưu nft master
      // const nftOwnerWallet = this.configService.get<string>('nftOwnerWallet');
      const nftEntity = await this.nftRepository.create({
        token: token,
        owner: STORE_OWNER,
        level: level,
        price: metaData.price,
        earningTime: metaData.earningTime,
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
    if (metaDataSimple[nftLevel]) {
      return metaDataSimple[nftLevel];
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
      level: nft.level,
      price: nft.price,
      status: nft.status,
      metaData: metaData,
      // earningTime: nft.earningTime,
      createdAt: _get(nft, 'createdAt'),
      updatedAt: _get(nft, 'updatedAt'),
    };
    return data;
  }

  async getStoreList(storeListDto: StoreListDto) {
    const nftStoreList = await this.nftRepository.getStoreNft();
    const result = new NftListItem();
    const list = nftStoreList.map((item) => {
      return this.populateNftInfo(item?.nft);
    });

    result.docs = list;
    return { ...result };
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

  public async actionStaking(actionDto: ActionDto) {
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

  public async addToMarket(actionDto: ActionDto) {
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
}
