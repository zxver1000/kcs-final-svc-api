import { ApiProperty } from '@nestjs/swagger';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Document, Types } from 'mongoose';

export class User extends Document {
  @ApiProperty({
    example: 'user@mail.com',
    description: 'Email Address',
    required: true,
  })
  @Prop({
    require: true,
    unique: true,
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Eugene',
    description: 'User Name',
    required: true,
  })
  @Prop({
    require: true,
    unique: true,
  })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({
    example: 'a1s2d3',
    description: 'Password',
    required: true,
  })
  @Prop({
    require: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Prop()
  @IsString()
  profileimage: string;

  @ApiProperty({
    example: 'true',
    description: 'Whether email have validated or not',
    required: true,
    default: false,
  })
  @Prop({
    required: true,
    default: false,
  })
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

_UserSchema.set('toObject', { virtuals: true });
_UserSchema.set('toJSON', { virtuals: true });

export const UserSchema = _UserSchema;

export interface UserReadOnly {
  id: string;
  email: string;
  emailValid: boolean;
  nickname: string;
  profileimage: string;
}
