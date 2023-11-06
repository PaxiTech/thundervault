import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginOperatorDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    required: true,
    description: 'email',
    example: 'abc@gmail.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    description: 'password',
    example: '12345',
  })
  password: string;
}
