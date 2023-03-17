import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Document, HydratedDocument, Types } from 'mongoose';
import { PostDate, PostDateDeserialization } from './post.PostDate';
import { Outlay, OutLayDeserialization } from './post.Outlay';
import { Weather, WeatherDeserialization } from './post.Weather';
import { Adapter, PostAdapter } from './post.schema.adpater';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { LightPost_ } from './dto/LightPostDto';

const options: SchemaOptions = {
  //* MongoDB 아래에 생성될 collection 이름 지정
  //* 지정 안하면 class 첫글자 소문자, 제일 마지막에 s 붙임
  collection: 'post',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  id: true,
};
export type PostDocument = HydratedDocument<Post>;

@Schema(options)
export class Post extends Document implements LightPost_ {
  @ApiProperty({
    example: '{yyyy-MM-dd-hh-mm}',
    description: 'PostDate',
    required: true,
  })
  @Prop({
    require: true,
  })
  @IsString()
  @IsNotEmpty()
  PostDate: PostDate = null;

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
  Outlay: Outlay = null;

  @Prop({
    required: true,
  })
  @IsString()
  Weather: Weather = null;

  @Prop({
    required: true,
  })
  owner: string = null;

  @Prop()
  file_id: string[] = null;

  //* Let Redis Use This DTO
  //* Check redis-manager-service.ts
  readonly readOnlyData: {
    id: string;
    PostDate: PostDate;
    Outlay: Outlay;
    Weather: Weather;
  };

  readonly LightPost: {
    id: string;
    Outlay: Outlay;
    owner: string;
    file_id: string[];
  };

  getInstance() {}
}

export const _PostSchema = SchemaFactory.createForClass(Post);

_PostSchema.virtual('readOnlyData').get(function (this: Post) {
  return {
    id: this.id,
    PostDate: this.PostDate,
    Outlay: this.Outlay,
    Weather: this.Weather,
  };
});
_PostSchema.virtual('LightPost').get(function (this: Post) {
  if (this.Outlay != undefined && this.file_id.length != 0)
    return {
      id: this.id,
      memo: this.Outlay.memo,
      title: this.Outlay.title,
      owner: this.owner,
      file_id: this.file_id,
    };
  else if (this.Outlay != undefined) {
    return {
      id: this.id,
      memo: this.Outlay.memo,
      title: this.Outlay.title,
      owner: this.owner,
    };
  }

  return {
    id: this.id,
    owner: this.owner,
  };
});

_PostSchema.set('toObject', { virtuals: true });
_PostSchema.set('toJSON', { virtuals: true });
_PostSchema.plugin(mongoosePaginate);
export const PostSchema = _PostSchema;

export function PostSchemaSerialization(O: object): string {
  return JSON.stringify(O);
}

export function PostSchemaDeserialization(deserial: Post): Post {
  //let deserial = JSON.parse(str);
  //let return_value = new Post();
  console.log('zd');

  if (deserial['PostDate']) {
    deserial['PostDate'] = PostDateDeserialization(deserial['PostDate']);
    //return_value.PostDate = deserial['PostDate'];
  }

  if (deserial['Outlay']) {
    deserial['Outlay'] = OutLayDeserialization(deserial['Outlay']);
    // return_value.Outlay = deserial['Outlay'];
  }
  if (deserial['Weather']) {
    deserial['Weather'] = WeatherDeserialization(deserial['Weather']);
    // return_value.Weather = deserial['Weather'];
  }

  return deserial;
}
