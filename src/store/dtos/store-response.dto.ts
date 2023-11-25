import { ApiProperty } from '@nestjs/swagger';

export enum StoreType {
  PRIVATE_SALE = 'PRIVATE',
  PUBLIC_SALE = 'PUBLIC',
}

export class StoreItem {
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
export class StoreItemResponse {
  @ApiProperty()
  status: number;
  @ApiProperty({ type: StoreItem })
  data: StoreItem;
}
export class StoreListItem {
  @ApiProperty({ isArray: true, type: StoreItem })
  docs: StoreItem[];
}

export class StoreListResponse {
  @ApiProperty()
  status: number;
  @ApiProperty()
  data: StoreListItem;
}
