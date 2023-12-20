import { CommonOptionalDto } from '@src/common/dtos/common.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';
export class StoreBuyNftDto extends CommonOptionalDto {
  @IsNotEmpty()
  level: number;

  @IsOptional()
  type: number;
}
