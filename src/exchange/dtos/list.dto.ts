import { ApiPropertyOptional } from '@nestjs/swagger';
import { CommonDto } from '@src/common/dtos/common.dto';
import { IsOptional } from 'class-validator';
export class FilterExchangeListDto extends CommonDto {
  @ApiPropertyOptional()
  @IsOptional()
  roundId: string;
}

export class ExchangeResultDto {
  @ApiPropertyOptional()
  @IsOptional()
  roundId: string;
}
