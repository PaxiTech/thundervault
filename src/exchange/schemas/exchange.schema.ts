import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { ExchangeType } from '@src/exchange/dtos/exchange-response.dto';
import { HydratedDocument } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

export type ExchangeDocument = HydratedDocument<Exchange>;

@Schema({
  timestamps: true,
})
export class Exchange {
  @ApiProperty()
  @Prop()
  wallet: string;

  @ApiProperty()
  @Prop({ unique: true })
  transactionHash: string;

  @ApiProperty()
  @Prop()
  ownerWallet: string;

  @ApiProperty()
  @Prop()
  amount: number;

  @ApiProperty()
  @Prop()
  price: number;

  @ApiProperty()
  @Prop()
  ticketPrice: number;

  @ApiProperty()
  @Prop({ type: Number, min: 0 })
  amountForOneTicket: number;

  @ApiProperty({ enum: ExchangeType })
  @Prop({ default: ExchangeType.PRIVATE_SALE })
  exchangeType: ExchangeType;

  @ApiProperty()
  @Prop({ type: Number, min: 0 })
  amountToken: number;

  @ApiProperty()
  @Prop({ type: Number, min: 0 })
  amountTicket: number;

  @ApiProperty()
  @Prop()
  createTime: string;

  @ApiProperty()
  @Prop()
  roundId: string;
}

export const ExchangeSchema = SchemaFactory.createForClass(Exchange);
ExchangeSchema.plugin(paginate);
