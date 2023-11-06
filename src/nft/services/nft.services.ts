import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaginateDto } from '@src/common/dtos/paginate.dto';
import { CreateNftDto } from '@src/nft/dtos/create.dto';
import { FilterNftListDto } from '@src/nft/dtos/list.dto';
import { NftItem, NftListItem } from '@src/nft/dtos/nft-response.dto';
import { NftRepository } from '@src/nft/repositories/nft.repository';
import { NftDocument } from '@src/nft/schemas/nft.schema';
import { ethers } from 'ethers';
import * as fs from 'fs';
import { get as _get } from 'lodash';
import { Errors } from '@src/common/contracts/error';
import { AppException } from '@src/common/exceptions/app.exception';

@Injectable()
export class NftService {
  constructor(private nftRepository: NftRepository, private configService: ConfigService) {}

  public async createNft(createData: CreateNftDto): Promise<any> {
    const ownerWallet = this.configService.get<string>('ownerWallet');
    const nftToken = await this.generateNftToken();
    const nftEntity = await this.nftRepository.create({
      ...createData,
      token: nftToken,
      owner: ownerWallet,
    });
    this.saveNFTAsJson(nftToken, createData);
    return nftEntity;
    //const nftInfo = this.populateNftInfo(nftEntity);
    //return nftInfo;
  }

  /**
   *
   * @param paginationParam
   * @returns
   */
  async getNftList(filterQRcodeList: FilterNftListDto, paginationParam: PaginateDto) {
    const conditions = {};
    const nftList = await this.nftRepository.pagination({
      conditions: conditions,
      ...paginationParam,
      select: ['_id', 'name', 'token', 'description', 'level', 'image', 'owner'],
    });
    const { docs = [], ...pagination } = nftList;
    const result = new NftListItem();
    const list = docs.map((item) => {
      return this.populateNftInfo(item);
    });

    result.docs = list;
    return { ...result, ...pagination };
  }

  public async generateNftToken(): Promise<string> {
    let token: string;
    let isUnique = false;

    while (!isUnique) {
      const wallet = ethers.Wallet.createRandom();
      token = wallet.address; // Set the desired code length here

      const existingNftToken = await this.nftRepository.findOne({
        conditions: { token: token },
      });

      isUnique = !existingNftToken;
    }

    return token;
  }
  private saveNFTAsJson(token: string, data: any): void {
    const nftJson = JSON.stringify(data);
    const filesDestination = this.configService.get('nft_resource');

    const nftPath = `${filesDestination}${token}.json`;
    fs.writeFileSync(nftPath, nftJson);
  }

  public async getNftInfo(token: string): Promise<NftItem> {
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
    const userInfo = this.populateNftInfo(entity);
    return userInfo;
  }

  /**
   * populateNftInfo
   * @param nft {NftDocument}
   * @returns
   */
  public populateNftInfo(nft: NftDocument) {
    const data = {
      _id: _get(nft, '_id'),
      name: nft.name,
      token: nft.token,
      description: nft.description,
      level: nft.level,
      image: nft.image,
      owner: nft.owner,
      createdAt: _get(nft, 'createdAt'),
      updatedAt: _get(nft, 'updatedAt'),
    };
    return data;
  }
}
