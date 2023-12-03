import { CommonDto } from '@src/common/dtos/common.dto';
import { IsNotEmpty } from 'class-validator';
export class StoreBuyNftDto extends CommonDto {
  @IsNotEmpty()
  level: number;

  @IsNotEmpty()
  type: number;
}
