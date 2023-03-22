import { HttpStatus, Injectable, Logger } from '@nestjs/common';

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
  ): Promise<number> {
    return 500;
  }

  async addPersonalDiary(data: object, userid: string): Promise<number> {
    return 500;
  }
  async getPersonalDiary(
    PostId: string,
    userid: string,
  ): Promise<number | Post | object> {
    return 500;
  }
  async ListDiary(page_num: number, userid: string): Promise<number> {
    return 500;
  }

  async deletePersonalDiary(id: string[], userid: string): Promise<number> {
    return 500;
  }
}
