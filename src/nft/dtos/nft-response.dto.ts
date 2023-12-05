import { ApiProperty } from '@nestjs/swagger';

export enum NftType {
  PRIVATE_SALE = 'PRIVATE',
  PUBLIC_SALE = 'PUBLIC',
}

export class NftItem {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  owner: string;

  @ApiProperty()
  preOwner?: string;

  @ApiProperty()
  level: number;

  @ApiProperty()
  originalStakedDays?: number;

  @ApiProperty()
  status?: number;

  @ApiProperty()
  type?: number;

  @ApiProperty()
  amount?: number;

  @ApiProperty()
  stakedDays?: number;

  @ApiProperty()
  price?: number;

  @ApiProperty()
  chargeTime?: string;

  @ApiProperty()
  startTime?: string;

  @ApiProperty({ type: Date })
  createdAt?: Date;

  @ApiProperty({ type: Date })
  updatedAt?: Date;
}
export class NftItemResponse {
  @ApiProperty()
  status: number;
  @ApiProperty({ type: NftItem })
  data: NftItem;
}
export class NftListItem {
  @ApiProperty({ isArray: true, type: NftItem })
  docs: NftItem[];
}

export class NftListResponse {
  @ApiProperty()
  status: number;
  @ApiProperty()
  data: NftListItem;
}
