import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import AbstractRepository from '@src/common/abstracts/repository.abstract';
import { get as _get } from 'lodash';
import { PaginateModel } from 'mongoose';
import { CommissionRoi, CommissionRoiDocument } from '../schemas/commissionfee.schema';
@Injectable()
export class CommissionRoiRepository extends AbstractRepository<CommissionRoiDocument> {
  constructor(@InjectModel(CommissionRoi.name) model: PaginateModel<CommissionRoiDocument>) {
    super(model);
  }
  async getTotalCommissionRoiStakingByUser(wallet: string): Promise<number> {
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
  async getCurrentTotalCommissionRoiSystem(): Promise<number> {
    const data = await this.aggregate([
      {
        $group: {
          _id: null,
          currentTotalFree: { $sum: '$amountFee' },
        },
      },
    ]).exec();
    const record = _get(data, 0);
    if (!record) {
      return 0;
    }

    return record.currentTotalFree;
  }
}
