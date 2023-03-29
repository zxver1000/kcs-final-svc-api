import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document } from 'mongoose';
import { PostDate } from './modules/post.postdate';
import { Outlay } from './modules/post.outlay';
import { Weather } from './modules/post.weather';
import { Location } from './modules/post.location';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { deserializePostText, PostText } from './modules/post.text';
import { defaultPreview, PostPreview } from './modules/post.preview';

const options: SchemaOptions = {
  //* MongoDB 아래에 생성될 collection 이름 지정
  //* 지정 안하면 class 첫글자 소문자, 제일 마지막에 s 붙임
  collection: 'posts',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  id: true,
};
const DEFAULT_PREVIEW = '/img/logo.png';

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
  outlay: Outlay[];

  @Prop({
    required: true,
  })
  @IsString()
  weather: Weather;

  @Prop({
    required: true,
  })
  @IsString()
  log: PostText[];

  @Prop({
    required: true,
    default: defaultPreview,
  })
  @IsString()
  preview: PostPreview;

  //* Let Redis Use This DTO
  //* Check redis-manager-service.ts
  readonly readOnlyData: {
    id: string;
    owner: string;
    title: string;
    dates: PostDate;
    location: Location;
    outlay: Outlay[];
    log: PostText[];
    preview: PostPreview;
  };

  readonly lightReadOnlyData: {
    id: string;
    owner: string;
    title: string;
    dates: PostDate;
    location: Location;
    preview: PostPreview;
  };
}

export const _PostSchema = SchemaFactory.createForClass(Post);

_PostSchema.virtual('readOnlyData').get(function (this: Post) {
  return {
    id: this.id,
    owner: this.owner,
    preview: this.preview,
    title: this.title,
    dates: this.dates,
    location: this.location,
    outlay: this.outlay,
    log: this.log,
  };
});

_PostSchema.virtual('lightReadOnlyData').get(function (this: Post) {
  const preview = deserializePostText(this.log[0]);

  return {
    id: this.id,
    owner: this.owner,
    preview: this.preview,
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
  preview: PostPreview;
  title: string;
  dates: PostDate;
  location: Location;
  outlay: Outlay[];
  log: PostText[];
}

export interface PostReadOnlyLight {
  id: string;
  owner: string;
  preview: PostPreview;
  title: string;
  dates: PostDate;
  location: Location;
}
