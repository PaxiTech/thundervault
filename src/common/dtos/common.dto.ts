import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommonDto {
  @IsNotEmpty()
  @IsString()
  @Length(42, 42)
  @ApiProperty({
    required: true,
    description: 'Wallet address',
    example: '0x264D6BF791f6Be6F001A95e895AE0a904732d473',
    minLength: 42,
    maxLength: 42,
  })
  wallet: string;
}

export class CommonOptionalDto {
  @IsOptional()
  @IsString()
  @Length(42, 42)
  @ApiProperty({
    description: 'Wallet address',
    example: '0x264D6BF791f6Be6F001A95e895AE0a904732d473',
    minLength: 42,
    maxLength: 42,
  })
  wallet: string;
}
