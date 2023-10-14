import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
import { ApiProperty } from '@nestjs/swagger';
import { kycStatuses } from '@src/user/contracts/type';
export type UserDocument = HydratedDocument<User>;
@Schema({
  timestamps: true,
})
export class User {
  @ApiProperty()
  @Prop({
    required: true,
  })
  wallet: string;

  @ApiProperty()
  @Prop({
    default: kycStatuses.NEW_REGISTRY,
  })
  isVerified: number;

  @ApiProperty()
  @Prop()
  name?: string;

  @ApiProperty()
  @Prop()
  phone?: string;

  @ApiProperty()
  @Prop({
    lowercase: true,
  })
  email?: string;

  @ApiProperty()
  @Prop()
  address?: string;

  @ApiProperty()
  @Prop({
    maxlength: 250,
  })
  avatarImage?: string;

  @ApiProperty()
  @Prop({
    maxlength: 250,
  })
  selfieImage?: string;

  @ApiProperty()
  @Prop({
    maxlength: 250,
  })
  idFrontImage?: string;

  @ApiProperty()
  @Prop({
    maxlength: 250,
  })
  idBackImage?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(paginate);
