import AbstractRepository from '@src/common/abstracts/repository.abstract';
import { PaginateModel } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exchange, ExchangeDocument } from '../schemas/exchange.schema';
import { get as _get } from 'lodash';

@Injectable()
export class ExchangeRepository extends AbstractRepository<ExchangeDocument> {
  constructor(@InjectModel(Exchange.name) model: PaginateModel<ExchangeDocument>) {
    super(model);
  }
  async getTotalHasBeenSale(roundId: string): Promise<number> {
    const data = await this.aggregate([
      {
        $match: {
          roundId: roundId,
        },
      },
      {
        $group: {
          _id: null,
          amount: { $sum: '$amount' },
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
