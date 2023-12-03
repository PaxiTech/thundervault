import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import AbstractRepository from '@src/common/abstracts/repository.abstract';
import { get as _get } from 'lodash';
import { PaginateModel } from 'mongoose';
import { CommissionFee, CommissionFeeDocument } from '../schemas/commissionfee.schema';
@Injectable()
export class CommissionFeeRepository extends AbstractRepository<CommissionFeeDocument> {
  constructor(@InjectModel(CommissionFee.name) model: PaginateModel<CommissionFeeDocument>) {
    super(model);
  }
  async getTotalCommissionFeeStakingByUser(wallet: string): Promise<number> {
    const data = await this.aggregate([
      {
        $match: {
          owner: wallet,
        },
      },
      {
        $group: {
          _id: null,
          amountFee: { $sum: '$amountFee' },
        },
      },
    ]).exec();
    const record = _get(data, 0);
    if (!record) {
      return 0;
    }

    return record.amountFee;
  }
}
