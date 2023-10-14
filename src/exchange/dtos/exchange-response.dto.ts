import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ExchangeStatus {
  NEW = 'NEW',
  PROCESS = 'PROCESS',
  FINISH = 'FINISH',
  CANCEL = 'CANCEL',
}

export enum ExchangeType {
  PUBLIC_SALE = 'PUBLIC',
  PRIVATE_SALE = 'PRIVATE',
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
  tokenAddress?: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  discountPercent?: number;

  @ApiProperty()
  discountPrice?: number;

  @ApiProperty()
  discountTotal?: number;

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
  maxAmount: number;
}

export class openSaleItemResponse {
  @ApiProperty()
  status: number;
  @ApiProperty({ type: openSaleItem })
  data: openSaleItem;
}
