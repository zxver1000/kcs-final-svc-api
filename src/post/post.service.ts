import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PostCreateDto } from './data/dto/post.create.dto';
import { deserializeLocation } from './data/modules/post.location';
import { deserializeOutlay } from './data/modules/post.outlay';
import { deserializePostDate } from './data/modules/post.postdate';
import { deserializePostText } from './data/modules/post.text';
import { deserializePostWeather } from './data/modules/post.weather';

import { PostRepository } from './data/post.repository';
import { Post } from './data/post.schema';

@Injectable()
export class PostService {
  constructor(private readonly postRepositroy: PostRepository) {}

  private logger = new Logger('PostService Logger');

  async modifyPostFromDB(
    id: string,
    userid: string,
    updateData: object,
  ): Promise<number | object> {
    try {
      let Post_data = await this.postRepositroy.getPost(id, userid);

      if (typeof Post_data === 'number') return Post_data;

      const result = await this.postRepositroy.modifyPostFromDB(id, updateData);

      if (typeof result === 'number') {
        return result;
      }
      if (!!result) return result.readOnlyData;
    } catch (e) {
      this.logger.error(e.stack || e);
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  async addPersonalDiary(
    data: PostCreateDto,
    userid: string,
  ): Promise<number | object> {
    try {
      let Outlay_Deserialization = deserializeOutlay(data.outlay);
      let Weather_Deserialization = deserializePostWeather(data.Weather);
      console.log(Outlay_Deserialization);
      console.log(Weather_Deserialization);
      let PostDate_Deserialization = deserializePostDate(data.dates);

      console.log(PostDate_Deserialization);
      let PostText_Deserialization = [];

      if (data.log != null) {
        for (let i = 0; i < data.log.length; i++) {
          PostText_Deserialization.push(deserializePostText(data.log[i]));
        }
      }
      let Location_Deserialization = deserializeLocation(data.location);
      const result = await this.postRepositroy.addToPostFromDB(
        Outlay_Deserialization,
        Weather_Deserialization,
        PostDate_Deserialization,
        PostText_Deserialization,
        Location_Deserialization,
        data.title,
        userid,
      );

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
  async getPersonalDiary(
    PostId: string,
    userid: string,
  ): Promise<number | Post | object> {
    if (PostId.length != 24) return HttpStatus.BAD_REQUEST;

    try {
      let result = await this.postRepositroy.getPost(PostId, userid);
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
  ): Promise<number | Array<object>> {
    if (page_num == null || isNaN(page_num)) return HttpStatus.BAD_REQUEST;

    try {
      let result = this.postRepositroy.getPosts(page_num, userid);

      return result;
    } catch (e) {
      this.logger.error(e.stack || e);
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  async deletePersonalDiary(id: string[], userid: string): Promise<number> {
    try {
      for (let i = 0; i < id.length; i++) {
        let PostData = await this.postRepositroy.getPost(id[i], userid);
        if (typeof PostData != 'number') {
          let result = await this.postRepositroy.deletePostFromDB(
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
