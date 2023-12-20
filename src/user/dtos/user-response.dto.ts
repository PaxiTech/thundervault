import { ApiProperty } from '@nestjs/swagger';

export class UserItem {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  wallet: string;

  @ApiProperty()
  level: number;

  @ApiProperty()
  preRefCode: string;

  @ApiProperty()
  myRefCode: string;

  @ApiProperty()
  refLevel1?: string;

  @ApiProperty()
  refLevel2?: string;

  @ApiProperty()
  refLevel3?: string;

  @ApiProperty()
  refLevel4?: string;

  @ApiProperty()
  refLevel5?: string;

  @ApiProperty()
  refLevel6?: string;

  @ApiProperty()
  refLevel7?: string;

  @ApiProperty()
  refLevel8?: string;

  @ApiProperty({ type: Date })
  createdAt?: Date;

  @ApiProperty({ type: Date })
  updatedAt?: Date;
}
export class UserItemResponse {
  @ApiProperty()
  status: number;
  @ApiProperty({ type: UserItem })
  data: UserItem;
}
export class UserListItem {
  @ApiProperty({ isArray: true, type: UserItem })
  docs: UserItem[];
}

export class UserListResponse {
  @ApiProperty()
  status: number;
  @ApiProperty()
  data: UserListItem;
}
