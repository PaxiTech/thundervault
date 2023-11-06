import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginateDto } from '@src/common/dtos/paginate.dto';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
export class FilterNftListDto extends PaginateDto {
  @ApiPropertyOptional()
  @IsOptional()
  keyword: string;
}

export class DetailNftDto {
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
}
