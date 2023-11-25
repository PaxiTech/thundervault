import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

export type PoolStakingDocument = HydratedDocument<PoolStaking>;

@Schema({
  timestamps: true,
})
export class PoolStaking {
  @ApiProperty()
  @Prop()
  from: string;

  @ApiProperty()
  @Prop()
  nft: string;

  @ApiProperty()
  @Prop()
  refLevel: number;

  @ApiProperty()
  @Prop()
  earningValue: number;
}

export const PoolStakingSchema = SchemaFactory.createForClass(PoolStaking);
PoolStakingSchema.plugin(paginate);
