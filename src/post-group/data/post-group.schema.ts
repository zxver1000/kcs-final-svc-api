import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document } from 'mongoose';

import * as mongoosePaginate from 'mongoose-paginate-v2';
import { PostDate } from '../../post/data/modules/post.postdate';
import {
  defaultPreview,
  PostPreview,
} from '../../post/data/modules/post.preview';
import { Post } from 'src/post/data/post.schema';

const options: SchemaOptions = {
  //* MongoDB 아래에 생성될 collection 이름 지정
  //* 지정 안하면 class 첫글자 소문자, 제일 마지막에 s 붙임
  collection: 'postGroup',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  id: true,
};

@Schema(options)
export class PostGroup extends Document {
  @ApiProperty({
    example: 'Mongo Object ID',
    description: 'Mongo Object ID',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  owner: string;

  @Prop()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Prop({
    default: [],
  })
  posts: Post[] = [];

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  dates: PostDate;

  @Prop({
    default: defaultPreview,
  })
  preview: PostPreview;

  readonly readOnlyData: {
    id: string;
    owner: string;
    title: string;
    dates: PostDate;
    preview: PostPreview;
    posts: Post[];
  };
}

export const _PostGroupSchema = SchemaFactory.createForClass(PostGroup);
_PostGroupSchema.virtual('readOnlyData').get(function (this: PostGroup) {
  return {
    id: this.id,
    owner: this.owner,
    preview: this.preview,
    title: this.title,
    dates: this.dates,
    posts: this.posts,
  };
});

_PostGroupSchema.set('toObject', { virtuals: true });
_PostGroupSchema.set('toJSON', { virtuals: true });
_PostGroupSchema.plugin(mongoosePaginate);

export const PostGroupSchema = _PostGroupSchema;
