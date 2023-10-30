import { ApiProperty } from '@nestjs/swagger';

export class UserItem {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  wallet: string;

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
