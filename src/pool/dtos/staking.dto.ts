import { ApiProperty } from '@nestjs/swagger';
import { CommonDto } from '@src/common/dtos/common.dto';
import { IsNotEmpty } from 'class-validator';
export class StakingDto extends CommonDto {
  @ApiProperty()
  @IsNotEmpty()
  token: string;
}
