import { CommonDto } from '@src/common/dtos/common.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';
export class StoreBuyNftDto extends CommonDto {
  @IsNotEmpty()
  level: number;

  @IsOptional()
  type: number;
}
