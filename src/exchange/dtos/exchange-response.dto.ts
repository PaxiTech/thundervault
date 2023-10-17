import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ExchangeStatus {
  NEW = 'NEW',
  PROCESS = 'PROCESS',
  FINISH = 'FINISH',
  CANCEL = 'CANCEL',
}

export enum ExchangeType {
  PRIVATE_SALE = 'PRIVATE',
  PUBLIC_SALE = 'PUBLIC',
}

export class ExchangeItem {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  ownerId: string;

  @ApiProperty({ enum: ExchangeType })
  exchangeType: ExchangeType;

  @ApiProperty({ enum: ExchangeStatus })
  status: ExchangeStatus;

  @ApiProperty()
  tokenName?: string;

  @ApiProperty()
  token?: string;

  @ApiProperty()
  tokenSymbol?: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  amountTicket: number;

  @ApiProperty()
  amountToken: number;

  @ApiProperty()
  amountForOneTicket: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  discountPercent?: number;

  @ApiProperty()
  discountPrice?: number;

  @ApiProperty()
  discountTotal?: number;

  @ApiProperty()
  transactionValue?: number;

  @ApiProperty()
  transactionHash?: string;

  @ApiProperty()
  ownerWallet?: string;

  @ApiProperty()
  createTime: string;

  @ApiProperty()
  wallet: string;

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

export class openSaleItem {
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

export class openSaleItemResponse {
  @ApiProperty()
  status: number;
  @ApiProperty({ type: openSaleItem })
  data: openSaleItem;
}
