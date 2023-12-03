import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

export enum COMMISSION_TYPE {
  DIRECT = 'direct',
  STAKING = 'staking',
}
export type CommissionFeeDocument = HydratedDocument<CommissionFee>;
export class CommissionFee {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  owner: string;

  @Prop({ required: true })
  from: string; // nhận được nhờ thăng nào.

  @Prop({ required: true })
  price: number;

  @Prop()
  amountFee: number;

  @Prop()
  refCode: string;

  @Prop()
  refLevel: number;

  @Prop()
  type: number;
}

export const CommissionFeeSchema = SchemaFactory.createForClass(CommissionFee);
CommissionFeeSchema.plugin(paginate);
