import { ApiProperty } from '@nestjs/swagger';

export enum MarketType {
  PRIVATE_SALE = 'PRIVATE',
  PUBLIC_SALE = 'PUBLIC',
}

export class MarketItem {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  owner: string;

  @ApiProperty()
  level: number;

  @ApiProperty()
  originalStakedDays?: number;

  @ApiProperty({ type: Date })
  createdAt?: Date;

  @ApiProperty({ type: Date })
  updatedAt?: Date;
}
export class MarketItemResponse {
  @ApiProperty()
  status: number;
  @ApiProperty({ type: MarketItem })
  data: MarketItem;
}
export class MarketListItem {
  @ApiProperty({ isArray: true, type: MarketItem })
  docs: MarketItem[];
}

export class MarketListResponse {
  @ApiProperty()
  status: number;
  @ApiProperty()
  data: MarketListItem;
}
