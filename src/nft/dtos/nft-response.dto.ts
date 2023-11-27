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
  level: number;

  @ApiProperty()
  earningTime?: number;

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