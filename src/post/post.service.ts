import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { type } from 'os';
import { LightPostDto } from './data/dto/LightPostDto';
import {
  Location,
  LocationDeserialization,
  LocationSerialization,
} from './data/post.Location';
import {
  Outlay,
  OutLayDeserialization,
  OutLaySerialization,
} from './data/post.Outlay';
import { PostDate, PostDateDeserialization } from './data/post.PostDate';
import { PostRepository } from './data/post.repository';
import {
  PostSchema,
  Post,
  PostDocument,
  PostSchemaSerialization,
  PostSchemaDeserialization,
} from './data/post.schema';
import { Weather, WeatherDeserialization } from './data/post.Weather';

@Injectable()
export class PostService {
  constructor(private readonly PostRepositroy: PostRepository) {}

  private logger = new Logger('PostService Logger');

  async modifyPostFromDB(id: string, userid: string, updateData: object) {
    try {
      let Post_data = await this.PostRepositroy.getPost(id);

      if (typeof Post_data === 'number') return Post_data;

      if (Post_data.owner != userid) return HttpStatus.UNAUTHORIZED;

      let result = await this.PostRepositroy.modifyPostFromDB(id, updateData);

      if (typeof result === 'number') {
        return result;
      }
      if (!!result) return result.readOnlyData;
    } catch (e) {
      this.logger.error(e.stack || e);
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  async addPersonalDiary(data: object, userid: string): Promise<number> {
    try {
      let Outlay_Deserialization = OutLayDeserialization(data['Outlay']);
      let Weather_Deserialization = WeatherDeserialization(data['Weather']);
      let PostDate_Deserialization = PostDateDeserialization(data['PostDate']);

      let result = this.PostRepositroy.addToPostFromDB(
        Outlay_Deserialization,
        Weather_Deserialization,
        PostDate_Deserialization,
        userid,
        data['file_id'],
      );
      return result;
    } catch (e) {
      this.logger.error(e.stack || e);
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
  async getPersonalDiary(
    PostId: string,
    userid: string,
  ): Promise<number | Post | object> {
    try {
      let result = await this.PostRepositroy.getPost(PostId);
      if (typeof result === 'number') {
        return result;
      }

      if (!!result) {
        return result.readOnlyData;
      }
    } catch (e) {
      this.logger.error(e.stack || e);
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
  async ListDiary(
    page_num: number,
    userid: string,
  ): Promise<number | LightPostDto[]> {
    if (isNaN(page_num)) return HttpStatus.BAD_REQUEST;

    try {
      let result = this.PostRepositroy.getPosts(page_num, userid);

      return result;
    } catch (e) {
      this.logger.error(e.stack || e);
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  async deletePersonalDiary(id: string[], userid: string): Promise<number> {
    try {
      for (let i = 0; i < id.length; i++) {
        let PostData = await this.PostRepositroy.getPost(id[i]);
        if (typeof PostData != 'number') {
          let result = await this.PostRepositroy.deletePostFromDB(
            PostData,
            userid,
          );
        }
      }

      return HttpStatus.OK;
    } catch (e) {
      this.logger.error(e.stack || e);
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
