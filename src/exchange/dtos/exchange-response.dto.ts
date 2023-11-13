import { ApiProperty } from '@nestjs/swagger';

export enum ExchangeType {
  PRIVATE_SALE = 'PRIVATE',
  PUBLIC_SALE = 'PUBLIC',
}

export class ExchangeItem {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  wallet: string;

  @ApiProperty()
  transactionHash?: string;

  @ApiProperty()
  preRefWallet?: string;

  @ApiProperty()
  preRefAmount?: number;

  @ApiProperty()
  ownerWallet?: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  roundId?: string;

  @ApiProperty()
  ticketPrice: number;

  @ApiProperty()
  amountForOneTicket: number;

  @ApiProperty({ enum: ExchangeType })
  exchangeType: ExchangeType;

  @ApiProperty()
  amountToken: number;

  @ApiProperty()
  amountTicket: number;

  @ApiProperty()
  createTime: string;

  @ApiProperty({ type: Date })
  createdAt?: Date;

  @ApiProperty({ type: Date })
  updatedAt?: Date;
}
export class ExchangeItemResponse {
  @ApiProperty()
  status: number;
  @ApiProperty({ type: ExchangeItem })
  data: ExchangeItem;
}
export class ExchangeListItem {
  @ApiProperty({ isArray: true, type: ExchangeItem })
  docs: ExchangeItem[];
}

export class ExchangeListResponse {
  @ApiProperty()
  status: number;
  @ApiProperty()
  data: ExchangeListItem;
}

export class OpenSaleItem {
  @ApiProperty()
  id: string;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  startSaleTime: string;

  @ApiProperty()
  endTime: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  maxToken: number;

  @ApiProperty()
  totalTicketHadSale: number;

  @ApiProperty()
  totalUser: number;

  @ApiProperty()
  totalTimesSale: number;

  @ApiProperty()
  ticketPrice: number;

  @ApiProperty()
  amountForOneTicket: number;

  @ApiProperty()
  maxTicket: number;
}

export class OpenSaleItemResponse {
  @ApiProperty()
  status: number;
  @ApiProperty({ type: OpenSaleItem })
  data: OpenSaleItem;
}

export class CommonConfigItem {
  @ApiProperty()
  ownerWallet: string;
}
export class CommonConfigItemResponse {
  @ApiProperty()
  status: number;
  @ApiProperty({ type: CommonConfigItem })
  data: CommonConfigItem;
}
