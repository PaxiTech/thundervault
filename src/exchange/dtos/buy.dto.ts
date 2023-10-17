import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';
export class ExchangeBuyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amountTicket: number;

  @ApiProperty()
  @IsNotEmpty()
  roundId: string;

  // @ApiPropertyOptional()
  // @IsOptional()
  // tokenName: string;

  // @ApiPropertyOptional()
  // @IsOptional()
  // tokenSymbol: string;

  // @ApiPropertyOptional()
  // @ApiProperty({
  //   required: true,
  //   description: 'Ethereum account address',
  //   example: '0x264D6BF791f6Be6F001A95e895AE0a904732d473',
  //   minLength: 42,
  //   maxLength: 42,
  // })
  // @IsOptional()
  // @IsNotEmpty()
  // @IsString()
  // @Length(42, 42)
  // token: string;
}
