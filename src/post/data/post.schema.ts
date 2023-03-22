import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { Document, Types } from 'mongoose';
import { PostDate } from './modules/post.postdate';
import { Outlay } from './modules/post.outlay';
import { Weather } from './modules/post.weather';
import { Location } from './modules/post.location';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { PostText } from './modules/post.text';

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

  @Prop({
    required: true,
  })
  @IsString()
  log: PostText[];

  //* Let Redis Use This DTO
  //* Check redis-manager-service.ts
  readonly readOnlyData: {
    id: string;
    owner: string;
    title: string;
    dates: PostDate;
    location: Location;
    outlay: Outlay;
    log: PostText[];
  };

  readonly lightReadOnlyData: {
    id: string;
    owner: string;
    title: string;
    dates: PostDate;
    location: Location;
    preview: string;
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
    log: this.log,
  };
});

_PostSchema.virtual('lightReadOnlyData').get(function (this: Post) {
  return {
    id: this.id,
    owner: this.owner,
    title: this.title,
    dates: this.dates,
    location: this.location,
    preview: this.log[0]?.getPreview(),
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
  log: PostText[];
}

export interface PostReadOnlyLight {
  id: string;
  owner: string;
  title: string;
  dates: PostDate;
  location: Location;
  preview: string;
}
