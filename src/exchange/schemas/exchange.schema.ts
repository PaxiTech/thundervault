import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { ExchangeStatus, ExchangeType } from '@src/exchange/dtos/exchange-response.dto';
import { UserDocument } from '@src/user/schemas/user.schema';
import { HydratedDocument, Types } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

export type ExchangeDocument = HydratedDocument<Exchange>;

@Schema({
  timestamps: true,
})
export class Exchange {
  @ApiProperty({ enum: ExchangeType })
  @Prop({ default: ExchangeType.PRIVATE_SALE })
  exchangeType: ExchangeType;

  @ApiProperty({ enum: ExchangeStatus })
  @Prop({ default: ExchangeStatus.NEW })
  status: ExchangeStatus;

  @ApiProperty()
  @Prop()
  roundId: string;

  @ApiProperty()
  @Prop()
  tokenName: string;

  @ApiProperty()
  @Prop()
  tokenSymbol: string;

  @ApiProperty()
  @Prop()
  token: string;

  @ApiProperty()
  @Prop()
  price: number;

  @ApiProperty()
  @Prop({ type: Number, min: 0 })
  amountTicket: number;

  @ApiProperty()
  @Prop({ type: Number, min: 0 })
  amountForOneTicket: number;

  @ApiProperty()
  @Prop({ type: Number, min: 0 })
  amountToken: number;

  @ApiProperty()
  @Prop()
  total: number;

  @ApiProperty()
  @Prop()
  discountPercent: number;

  @ApiProperty()
  @Prop()
  discountPrice: number;

  @ApiProperty()
  @Prop()
  discountTotal: number;

  @ApiProperty()
  @Prop()
  transactionValue: number;

  @ApiProperty()
  @Prop({ unique: true })
  transactionHash: string;

  @ApiProperty()
  @Prop()
  ownerWallet: string;

  @ApiProperty()
  @Prop()
  createTime: string;

  @ApiProperty()
  @Prop()
  wallet: string;

  @ApiProperty()
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  ownerId?: Types.ObjectId | UserDocument;
}

export const ExchangeSchema = SchemaFactory.createForClass(Exchange);
ExchangeSchema.plugin(paginate);
