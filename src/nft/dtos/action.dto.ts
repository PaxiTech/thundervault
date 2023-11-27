import { ApiProperty } from '@nestjs/swagger';
import { NFT_STATUS, NFT_ACTION } from '@src/nft/schemas/nft.schema';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class ActionDto {
  @ApiProperty({
    required: true,
    description: 'Ethereum account address',
    example: '0x264D6BF791f6Be6F001A95e895AE0a904732d473',
    minLength: 42,
    maxLength: 42,
  })
  @IsNotEmpty()
  @IsString()
  fromWallet: string;

  @ApiProperty({
    required: true,
    description: 'nft address',
    example: '0x264D6BF791f6Be6F001A95e895AE0a904732d473',
    minLength: 42,
    maxLength: 42,
  })
  @IsNotEmpty()
  @IsString()
  nft: string;

  @ApiProperty({ enum: NFT_STATUS })
  @IsOptional()
  status: NFT_STATUS;

  @ApiProperty({ enum: NFT_ACTION })
  @IsOptional()
  action: NFT_ACTION;
}
