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
  NFT_LEVEL_7: 7,
  NFT_LEVEL_8: 8,
  NFT_LEVEL_9: 9,
};
@Schema({
  timestamps: true,
})
export class Nft {
  @Prop({ required: [true, 'token is unique'], unique: true })
  token: string;

  @Prop({ required: true })
  level: number;

  @Prop({ required: true })
  owner: string;

  @Prop({ required: true })
  @Prop()
  earningTime: number;
}

export const NftSchema = SchemaFactory.createForClass(Nft);
NftSchema.plugin(paginate);
