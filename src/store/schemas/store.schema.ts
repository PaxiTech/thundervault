import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

export type StoreDocument = HydratedDocument<Store>;

@Schema({
  timestamps: true,
})
export class Store {
  @ApiProperty()
  @Prop()
  owner: string;

  @ApiProperty()
  @Prop()
  nft: string;

  @ApiProperty()
  @Prop()
  transactionHash: string;

  @ApiProperty()
  @Prop()
  buyTime: string;

  @ApiProperty()
  @Prop()
  price: number;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
StoreSchema.plugin(paginate);
