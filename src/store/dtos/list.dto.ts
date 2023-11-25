import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginateDto } from '@src/common/dtos/paginate.dto';
import { IsOptional } from 'class-validator';
export class StoreListDto extends PaginateDto {
  @ApiPropertyOptional()
  @IsOptional()
  keyword: string;
}
