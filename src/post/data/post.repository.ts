import { HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RedisManagerService } from 'src/redis-manager/redis-manager.service';
import { Outlay } from './info/post.outlay';
import { PostDate } from './info/post.postdate';
import { Post, PostReadOnlyLight } from './post.schema';
import { Weather } from './info/post.weather';
import { Model, PaginateModel } from 'mongoose';

export class PostRepository {
  constructor(
    @InjectModel(Post.name) private postModel: PaginateModel<Post>,
    private readonly redisService: RedisManagerService,
  ) {}
  private readonly redisPrefixKey = 'Post';
  async addToPostFromDB(
    Outlay: Outlay,
    Weather: Weather,
    PostDate: PostDate,
    owner: string,
    file_id: string[],
  ): Promise<number> {
    return 500;
  }

  async modifyPostFromDB(
    id: string,
    update_Data: object,
  ): Promise<number | Post> {
    return 500;
  }
  async deletePostFromDB(Post: Post, userid: string): Promise<number> {
    return 500;
  }

  async getPosts(
    page_num: number,
    userid: string,
  ): Promise<PostReadOnlyLight[] | number> {
    return 500;
  }

  async getPost(id: string): Promise<Post | number> {
    return 500;
  }
}
