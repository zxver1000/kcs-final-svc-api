import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document, HydratedDocument } from 'mongoose';

const options: SchemaOptions = {
  //* MongoDB 아래에 생성될 collection 이름 지정
  //* 지정 안하면 class 첫글자 소문자, 제일 마지막에 s 붙임
  collection: 'users',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

@Schema(options)
export class UserSchema extends Document {
  @Prop({
    require: true,
    unique: true,
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @Prop({
    require: true,
  })
  @IsString()
  @IsNotEmpty()
  nickname: string;
  @Prop({
    require: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Prop()
  @IsString()
  profileimage: string;

  //* Let Redis Use This DTO
  //* Check redis-manager-service.ts

  readonly readOnlyData: {
    id: string;
    email: string;
    nickname: string;
    profileimage: string;
  };
}

export const UserReadOnlySchema = SchemaFactory.createForClass(UserSchema);

UserReadOnlySchema.virtual('readOnlyData').get(function (this: UserSchema) {
  return {
    id: this.id,
    email: this.email,
    nickname: this.nickname,
    profileimage: this.profileimage,
  };
});

export type userDocument = HydratedDocument<UserSchema>;
