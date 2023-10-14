import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class FilterExchangeListDto {
  // @ApiProperty({ type: String })
  // @ApiPropertyOptional()
  // @IsOptional()
  // keyword: string;
  @ApiPropertyOptional()
  @IsOptional()
  roundId: string;
}
