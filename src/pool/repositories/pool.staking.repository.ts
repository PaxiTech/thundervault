import AbstractRepository from '@src/common/abstracts/repository.abstract';
import { PaginateModel } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PoolStaking, PoolStakingDocument } from '../schemas/pool.staking.schema';

@Injectable()
export class PoolStakingRepository extends AbstractRepository<PoolStakingDocument> {
  constructor(@InjectModel(PoolStaking.name) model: PaginateModel<PoolStakingDocument>) {
    super(model);
  }
}
