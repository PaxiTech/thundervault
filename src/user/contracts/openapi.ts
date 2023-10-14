import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty()
  wallet: string;

  @ApiProperty()
  isVerified: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  avatarImage: string;

  @ApiProperty()
  selfieImage: string;

  @ApiProperty()
  idFrontImage: string;

  @ApiProperty()
  idBackImage: string;
}
