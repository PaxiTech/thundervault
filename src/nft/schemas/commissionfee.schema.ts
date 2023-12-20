import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

export enum COMMISSION_TYPE {
  DIRECT = 'direct',
  STAKING = 'staking',
  STAKING_DAY = 'staking_day',
}
export type CommissionRoiDocument = HydratedDocument<CommissionRoi>;
export class CommissionRoi {
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

export const CommissionRoiSchema = SchemaFactory.createForClass(CommissionRoi);
CommissionRoiSchema.plugin(paginate);
