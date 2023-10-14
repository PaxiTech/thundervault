import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';
export class UserKycDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  avatarImage: string;

  @ApiProperty()
  @IsNotEmpty()
  selfieImage: string;

  @ApiProperty()
  @IsNotEmpty()
  idFrontImage: string;

  @ApiProperty()
  @IsNotEmpty()
  idBackImage: string;
}
