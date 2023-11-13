import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
export type UserDocument = HydratedDocument<User>;

export const USER_LEVEL = {
  BEGINNER: 0,
  BRONZE: 1,
  SILVER: 2,
  GOLD: 3,
  PLATINUM: 4,
  RUBY: 5,
  DIAMOND: 6,
};

//có 8 cấp ref ứng với 8 col ref_level
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
  @Prop({ required: false })
  preRefCode: string;

  @ApiProperty()
  @Prop({ required: false })
  myRefCode: string;

  @ApiProperty()
  @Prop({
    default: USER_LEVEL.BEGINNER,
  })
  level: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    default: null,
  })
  refLevel1?: Types.ObjectId | UserDocument;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    default: null,
  })
  refLevel2?: Types.ObjectId | UserDocument;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    default: null,
  })
  refLevel3?: Types.ObjectId | UserDocument;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    default: null,
  })
  refLevel4?: Types.ObjectId | UserDocument;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    default: null,
  })
  refLevel5?: Types.ObjectId | UserDocument;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    default: null,
  })
  refLevel6?: Types.ObjectId | UserDocument;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    default: null,
  })
  refLevel7?: Types.ObjectId | UserDocument;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    default: null,
  })
  refLevel8?: Types.ObjectId | UserDocument;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(paginate);
