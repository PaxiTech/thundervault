import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
export type UserDocument = HydratedDocument<User>;

export const USER_LEVEL = {
  USER_LEVEL_0: 0,
  USER_LEVEL_1: 1,
  USER_LEVEL_2: 2,
  USER_LEVEL_3: 3,
  USER_LEVEL_4: 4,
  USER_LEVEL_5: 5,
  USER_LEVEL_6: 6,
  USER_LEVEL_7: 7,
  USER_LEVEL_8: 8,
  USER_LEVEL_9: 9,
  USER_LEVEL_10: 10,
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

  @Prop({ required: false, unique: true })
  referralCode: string;

  @ApiProperty()
  @Prop({
    default: USER_LEVEL.USER_LEVEL_0,
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
