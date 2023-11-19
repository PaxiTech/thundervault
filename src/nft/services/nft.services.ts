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

@Injectable()
export class NftService {
  constructor(private nftRepository: NftRepository, private configService: ConfigService) {}

  public async generateNft(data): Promise<any> {
    const { owner, token, level, metaData } = data;
    //lưu nft master
    const nftEntity = await this.nftRepository.create({
      token: token,
      owner: owner,
      level: level,
    });
    // tạo file json cho nft
    this.saveNFTAsJson(token, metaData);
    return nftEntity;
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
    fs.writeFileSync(nftPath, nftJson);
  }

  public async getNftInfo(token: string): Promise<any> {
    const conditions = {
      token: token,
    };
    const entity = await this.nftRepository.findOne({
      conditions: conditions,
    });
    if (!entity) {
      const { code, message, status } = Errors.NFT_NOT_EXIST;
      throw new AppException(code, message, status);
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
    const data = {
      _id: _get(nft, '_id'),
      token: nft.token,
      owner: nft.owner,
      level: nft.level,
      // earningTime: nft.earningTime,
      createdAt: _get(nft, 'createdAt'),
      updatedAt: _get(nft, 'updatedAt'),
    };
    return data;
  }
}
