import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';
export class ExchangeBuyDto {
  @ApiProperty()
  @IsNotEmpty()
  roundId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amountTicket: number;

  @ApiProperty({
    required: true,
    description: 'Ethereum account address',
    example: '0x264D6BF791f6Be6F001A95e895AE0a904732d473',
    minLength: 42,
    maxLength: 42,
  })
  @IsNotEmpty()
  @IsString()
  transactionHash: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(0)
  transactionValue: number;
}

export class ExchangeAddManualDto {
  @ApiProperty()
  @IsNotEmpty()
  secretKey: string;

  @ApiProperty()
  @IsNotEmpty()
  roundId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  transactionHash: string;

  @IsNotEmpty()
  @IsString()
  @Length(42, 42)
  @ApiProperty({
    required: true,
    description: 'Ethereum account address',
    example: '0x264D6BF791f6Be6F001A95e895AE0a904732d473',
    minLength: 42,
    maxLength: 42,
  })
  from: string;

  @IsNotEmpty()
  @IsString()
  @Length(42, 42)
  @ApiProperty({
    required: true,
    description: 'Ethereum account address',
    example: '0x264D6BF791f6Be6F001A95e895AE0a904732d473',
    minLength: 42,
    maxLength: 42,
  })
  to: string;
}
