import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Errors } from '@src/common/contracts/error';
import { PaginateDto } from '@src/common/dtos/paginate.dto';
import { AppException } from '@src/common/exceptions/app.exception';
import { FilterNftListDto } from '@src/nft/dtos/list.dto';
import { NftItem, NftListItem } from '@src/nft/dtos/nft-response.dto';
import { NftRepository } from '@src/nft/repositories/nft.repository';
import { NftDocument } from '@src/nft/schemas/nft.schema';
import { ethers } from 'ethers';
import * as fs from 'fs';
import { get as _get } from 'lodash';
import { metaDataSimple } from '@src/nft/contracts/meta-data';
import { STORE_OWNER } from '@src/nft/schemas/nft.schema';
import { StoreListDto } from '@src/store/dtos/list.dto';
import { NFT_STATUS } from '@src/nft/schemas/nft.schema';

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
}
