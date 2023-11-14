import { ApiProperty } from '@nestjs/swagger';

export class OperatorTokenOutput {
  @ApiProperty()
  token: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  fullName: string;
}

export class OperatorTokenResponse {
  @ApiProperty()
  status: number;
  @ApiProperty({ type: OperatorTokenOutput })
  data: OperatorTokenOutput;
}

export class OperatorOutput {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;
}

export class OperatorResponse {
  @ApiProperty()
  status: number;
  @ApiProperty({ type: OperatorOutput })
  data: OperatorOutput;
}

export class OperatorListOutput {
  @ApiProperty({ isArray: true, type: OperatorOutput })
  docs: OperatorOutput[];
}

export class OperatorListResponse {
  @ApiProperty()
  status: number;
  @ApiProperty()
  data: OperatorListOutput;
}
