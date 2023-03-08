import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Document } from 'mongoose';

const options: SchemaOptions = {
  //* MongoDB 아래에 생성될 collection 이름 지정
  //* 지정 안하면 class 첫글자 소문자, 제일 마지막에 s 붙임
  collection: 'users',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  id: true,
};

@Schema(options)
export class User extends Document {
  @Prop({
    require: true,
    unique: true,
  })
  @IsString()
  @IsEmail()
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

  @Prop()
  @IsBoolean()
  emailValid: boolean;

  //* Let Redis Use This DTO
  //* Check redis-manager-service.ts
  readonly readOnlyData: {
    id: string;
    email: string;
    emailValid: boolean;
    nickname: string;
    profileimage: string;
  };
}

export const _UserSchema = SchemaFactory.createForClass(User);

_UserSchema.virtual('readOnlyData').get(function (this: User) {
  return {
    id: this.id,
    email: this.email,
    emailValid: this.emailValid,
    nickname: this.nickname,
    profileimage: this.profileimage,
  };
});

export const UserSchema = _UserSchema;
