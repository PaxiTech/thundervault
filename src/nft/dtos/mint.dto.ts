import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
export class MintNftDto {
  @IsNotEmpty()
  @IsString()
  @Length(42, 42)
  @ApiProperty({
    required: true,
    description: 'Nft address',
    example: '0x264D6BF791f6Be6F001A95e895AE0a904732d473',
    minLength: 42,
    maxLength: 42,
  })
  token: string;

  @IsNotEmpty()
  level: number;
}
