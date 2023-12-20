import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import AbstractRepository from '@src/common/abstracts/repository.abstract';
import { PaginateModel } from 'mongoose';
import { Store, StoreDocument } from '../schemas/store.schema';

@Injectable()
export class StoreRepository extends AbstractRepository<StoreDocument> {
  constructor(@InjectModel(Store.name) model: PaginateModel<StoreDocument>) {
    super(model);
  }
}
