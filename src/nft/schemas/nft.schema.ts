import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

export type NftDocument = HydratedDocument<Nft>;

export const NFT_LEVEL = {
  NFT_LEVEL_1: 1,
  NFT_LEVEL_2: 2,
  NFT_LEVEL_3: 3,
  NFT_LEVEL_4: 4,
  NFT_LEVEL_5: 5,
  NFT_LEVEL_6: 6,
};
export const NFT_STATUS = {
  STORE: 1,
  WALLET: 2,
  STAKING: 3,
  MARKET: 4,
};
export const STORE_OWNER = 'store';
@Schema({
  timestamps: true,
})
export class Nft {
  @Prop({ required: [true, 'token is unique'], unique: true })
  token: string;

  @Prop({ required: true, default: STORE_OWNER })
  owner: string; // default store

  @Prop({ required: true })
  level: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  earningTime: number;

  @Prop({ required: true, default: false })
  isStaking: boolean;

  @Prop({ required: true, default: NFT_STATUS.STORE })
  status: number;

  @Prop()
  remainEarningTime?: number;
}

export const NftSchema = SchemaFactory.createForClass(Nft);
NftSchema.plugin(paginate);
