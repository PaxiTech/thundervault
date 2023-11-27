import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { NFT_STATUS } from '@src/nft/schemas/nft.schema';
export class UserListNftDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  wallet: string;

  @ApiProperty({ enum: NFT_STATUS })
  @IsOptional()
  status: NFT_STATUS;
}
