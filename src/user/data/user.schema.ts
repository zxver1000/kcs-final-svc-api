import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Document } from 'mongoose';

const options: SchemaOptions = {
  //* MongoDB 아래에 생성될 collection 이름 지정
  //* 지정 안하면 class 첫글자 소문자, 제일 마지막에 s 붙임
  collection: 'users',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

@Schema(options)
export class Users extends Document {
  @ApiProperty({
    example: 'user@mail.com',
    description: 'Email Address',
    required: true,
  })
  @Prop({
    required: true,
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Eugene',
    description: 'User Name',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'a1s2d3',
    description: 'Password',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  readonly readOnlyData: {
    id: string;
    email: string;
    name: string;
  };
}

//*
const _UsersSchema = SchemaFactory.createForClass(Users);

_UsersSchema.virtual('readOnlyData').get(function (this: Users) {
  return {
    id: this.id,
    email: this.email,
    name: this.name,
  };
});

export const UsersSchema = _UsersSchema;
