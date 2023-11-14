import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

export type NftDocument = HydratedDocument<Nft>;

@Schema({
  timestamps: true,
})
export class Nft {
  @Prop({ required: [true, 'token is unique'], unique: true })
  token: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  level: number;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  owner: string;

  @Prop({ required: true })
  @Prop()
  earningTime: number;
}

export const NftSchema = SchemaFactory.createForClass(Nft);
NftSchema.plugin(paginate);
