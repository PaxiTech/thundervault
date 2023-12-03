import AbstractRepository from '@src/common/abstracts/repository.abstract';
import { PaginateModel } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NFT_STATUS, Nft, NftDocument, STORE_OWNER } from '../schemas/nft.schema';
import { get as _get } from 'lodash';
@Injectable()
export class NftRepository extends AbstractRepository<NftDocument> {
  constructor(@InjectModel(Nft.name) model: PaginateModel<NftDocument>) {
    super(model);
  }
  async getStoreNft(): Promise<any> {
    const data = await this.aggregate([
      {
        $match: {
          owner: STORE_OWNER,
        },
      },
      { $group: { _id: '$level', nft: { $first: '$$ROOT' } } },
    ]).exec();

    return data;
  }
  async getTotalNftStakingByUser(wallet: string): Promise<number> {
    const data = await this.aggregate([
      {
        $match: {
          preOwner: wallet, // ví của user đang staking
          status: NFT_STATUS.STAKING, // điệu kiện nft đang staking
        },
      },
      {
        $group: {
          _id: null,
          amount: { $sum: '$price' },
        },
      },
    ]).exec();
    const record = _get(data, 0);
    if (!record) {
      return 0;
    }

    return record.amount;
  }
}
