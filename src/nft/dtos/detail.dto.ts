import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class DetailDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  token: string;
}
