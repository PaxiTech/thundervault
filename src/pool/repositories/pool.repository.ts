import AbstractRepository from '@src/common/abstracts/repository.abstract';
import { PaginateModel } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pool, PoolDocument } from '../schemas/pool.schema';
import { get as _get } from 'lodash';

@Injectable()
export class PoolRepository extends AbstractRepository<PoolDocument> {
  constructor(@InjectModel(Pool.name) model: PaginateModel<PoolDocument>) {
    super(model);
  }
}
