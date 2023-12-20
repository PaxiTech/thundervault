import { ApiProperty } from '@nestjs/swagger';
import { CommonDto } from '@src/common/dtos/common.dto';
import { IsOptional, IsString } from 'class-validator';

export class UserPreRefDto extends CommonDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'referral code',
    example: 'abcdef1234',
  })
  refCode: string;
}
