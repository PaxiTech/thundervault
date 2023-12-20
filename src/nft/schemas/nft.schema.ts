import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

export type NftDocument = HydratedDocument<Nft>;

export const NFT_LEVEL = {
  NFT_LEVEL_1: 1, // bronze
  NFT_LEVEL_2: 2, //silver
  NFT_LEVEL_3: 3, // gold
  NFT_LEVEL_4: 4, //platinum
  NFT_LEVEL_5: 5, //ruby
  NFT_LEVEL_6: 6, //diamond
};
export enum NFT_STATUS {
  STORE = 1, // đang trong store
  WALLET = 2, // thuộc của user
  STAKING = 3, // đang staking
  MARKET = 4, // đang trên market
}

export enum NFT_TYPE {
  TYPE_1 = 1,
  TYPE_2 = 2,
  TYPE_3 = 3,
}
export enum NFT_ACTION {
  market = 'market',
  staking = 'staking',
  unStaking = 'unStaking',
  buy = 'buy',
}
export const STORE_OWNER = 'store';
@Schema({
  timestamps: true,
})
export class Nft {
  @Prop({ required: [true, 'token is unique'], unique: true })
  token: string;

  @Prop({ required: true, default: STORE_OWNER })
  owner: string; // default store

  @Prop()
  preOwner: string; // khi staking or add to market, thì lưu lại preOwner dể xác định chủ của token trước

  @Prop({ required: true })
  level: number;

  @Prop({ required: true })
  originalStakedDays: number;

  @Prop({ required: true, default: NFT_STATUS.STORE })
  status: number;

  @Prop()
  type: number;

  @Prop()
  amount: number;

  @Prop()
  stakedDays: number;

  @Prop()
  chargeTime?: string;

  @Prop()
  startTime?: string;

  @Prop()
  price?: number;
}

export const NftSchema = SchemaFactory.createForClass(Nft);
NftSchema.plugin(paginate);
