import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { Document, Types } from 'mongoose';
import { PostDate } from './info/post.postdate';
import { Outlay } from './info/post.outlay';
import { Weather } from './info/post.weather';
import { Location } from './info/post.location';
import * as mongoosePaginate from 'mongoose-paginate-v2';

const options: SchemaOptions = {
  //* MongoDB 아래에 생성될 collection 이름 지정
  //* 지정 안하면 class 첫글자 소문자, 제일 마지막에 s 붙임
  collection: 'posts',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  id: true,
};

@Schema(options)
export class Post extends Document {
  @ApiProperty({
    example: 'Mongo Object ID',
    description: 'Mongo Object ID',
    required: true,
  })
  @Prop({
    require: true,
  })
  @IsString()
  @IsNotEmpty()
  owner: string;

  @ApiProperty({
    example: 'The Best Trip Ever in Switzerland',
    description: 'Diary Title',
    required: true,
  })
  @Prop({
    require: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Prop({
    require: true,
  })
  @IsString()
  @IsNotEmpty()
  location: Location;

  @ApiProperty({
    example: '',
    description: '',
    required: true,
  })
  @Prop({
    require: true,
  })
  @IsString()
  @IsNotEmpty()
  dates: PostDate;

  @ApiProperty({
    example: 'Eugene',
    description: 'Out lay data',
    required: true,
  })
  @Prop({
    require: true,
  })
  @IsString()
  @IsNotEmpty()
  outlay: Outlay;

  @Prop({
    required: true,
  })
  @IsString()
  Weather: Weather;

  //* Let Redis Use This DTO
  //* Check redis-manager-service.ts
  readonly readOnlyData: {
    id: string;
    owner: string;
    title: string;
    dates: PostDate;
    location: Location;
    outlay: Outlay;
  };

  readonly lightReadOnlyData: {
    id: string;
    owner: string;
    title: string;
    dates: PostDate;
    location: Location;
  };
}

export const _PostSchema = SchemaFactory.createForClass(Post);

_PostSchema.virtual('readOnlyData').get(function (this: Post) {
  return {
    id: this.id,
    owner: this.owner,
    title: this.title,
    dates: this.dates,
    location: this.location,
    outlay: this.outlay,
  };
});

_PostSchema.virtual('lightReadOnlyData').get(function (this: Post) {
  return {
    id: this.id,
    owner: this.owner,
    title: this.title,
    dates: this.dates,
    location: this.location,
  };
});

_PostSchema.set('toObject', { virtuals: true });
_PostSchema.set('toJSON', { virtuals: true });
_PostSchema.plugin(mongoosePaginate);

export const PostSchema = _PostSchema;

export interface PostReadOnly {
  id: string;
  owner: string;
  title: string;
  dates: PostDate;
  location: Location;
  outlay: Outlay;
}

export interface PostReadOnlyLight {
  id: string;
  owner: string;
  title: string;
  dates: PostDate;
  location: Location;
}
