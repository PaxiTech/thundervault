import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
export class StakingDto {
  @ApiProperty()
  @IsNotEmpty()
  nft: string;

  @ApiProperty()
  @IsOptional()
  refCode: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  level: number;

  @ApiProperty({
    required: true,
    description: 'Ethereum account address',
    example: '0x264D6BF791f6Be6F001A95e895AE0a904732d473',
    minLength: 42,
    maxLength: 42,
  })
  @IsNotEmpty()
  @IsString()
  @Length(42, 42)
  from: string;

  @ApiProperty({
    required: true,
    description: 'Ethereum account address',
    example: '0x264D6BF791f6Be6F001A95e895AE0a904732d473',
    minLength: 42,
    maxLength: 42,
  })
  @IsNotEmpty()
  @IsString()
  @Length(42, 42)
  to: string;
}
