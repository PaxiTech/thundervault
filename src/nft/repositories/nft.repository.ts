import AbstractRepository from '@src/common/abstracts/repository.abstract';
import { PaginateModel } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Nft, NftDocument } from '../schemas/nft.schema';

@Injectable()
export class NftRepository extends AbstractRepository<NftDocument> {
  constructor(@InjectModel(Nft.name) model: PaginateModel<NftDocument>) {
    super(model);
  }
}
