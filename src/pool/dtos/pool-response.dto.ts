import { ApiProperty } from '@nestjs/swagger';

export class PoolItem {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  nft: string;

  @ApiProperty()
  level: string;

  @ApiProperty()
  from: string;

  @ApiProperty()
  to: string; //owner wallet

  @ApiProperty()
  remainEarningTime: number;

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
