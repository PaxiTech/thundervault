import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

export type PoolDocument = HydratedDocument<Pool>;

@Schema({
  timestamps: true,
})
export class Pool {
  @ApiProperty()
  @Prop()
  nft: string;

  @ApiProperty()
  @Prop()
  level: string;

  @ApiProperty()
  @Prop()
  from: string;

  @ApiProperty()
  @Prop()
  to: string; //owner wallet

  @ApiProperty()
  @Prop()
  remainTime: string;
}

export const PoolSchema = SchemaFactory.createForClass(Pool);
PoolSchema.plugin(paginate);
