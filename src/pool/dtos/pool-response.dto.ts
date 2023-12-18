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

export class PoolInfo {
  @ApiProperty()
  totalNftStaked: number;

  // @ApiProperty()
  // totalSystemCommissionFee: number;

  @ApiProperty()
  currentTotalCommissionFeeSystem: number;

  // @ApiProperty()
  // remainCommissionFee: number;

  @ApiProperty()
  myTotalNftStaked?: number;

  @ApiProperty()
  myCommissionFee?: number;
}
export class PoolInfoResponse {
  @ApiProperty()
  status: number;
  @ApiProperty({ type: PoolInfo })
  data: PoolInfo;
}
