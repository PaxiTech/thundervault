import { ApiProperty } from '@nestjs/swagger';

export enum NftType {
  PRIVATE_SALE = 'PRIVATE',
  PUBLIC_SALE = 'PUBLIC',
}

export class NftItem {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  level: number;

  @ApiProperty()
  earningTime: number;

  @ApiProperty()
  image: string;

  @ApiProperty()
  owner: string;

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
