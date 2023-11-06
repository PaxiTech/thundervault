import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
export class OperatorUpdateDto {
  @ApiProperty()
  @IsOptional()
  @IsEmail()
  @ApiProperty({
    required: true,
    description: 'email',
    example: 'abc@gmail.com',
  })
  email: string;

  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    required: true,
    description: 'password',
    example: '12345',
  })
  password: string;

  @ApiProperty()
  @IsOptional()
  fullName: string;
}
