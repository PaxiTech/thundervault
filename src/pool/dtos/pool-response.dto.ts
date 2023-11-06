import { ApiProperty } from '@nestjs/swagger';

export enum PoolType {
  PRIVATE_SALE = 'PRIVATE',
  PUBLIC_SALE = 'PUBLIC',
}

export class PoolItem {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  wallet: string;

  @ApiProperty()
  transactionHash?: string;

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

  @ApiProperty({ enum: PoolType })
  poolType: PoolType;

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
export class PoolItemResponse {
  @ApiProperty()
  status: number;
  @ApiProperty({ type: PoolItem })
  data: PoolItem;
}
export class PoolListItem {
  @ApiProperty({ isArray: true, type: PoolItem })
  docs: PoolItem[];
}

export class PoolListResponse {
  @ApiProperty()
  status: number;
  @ApiProperty()
  data: PoolListItem;
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
