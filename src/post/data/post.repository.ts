import { HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RedisManagerService } from '../../redis-manager/redis-manager.service';
import { Post } from './post.schema';
import { PaginateModel } from 'mongoose';
import { PostCreateDto } from './dto/post.create.dto';
import { PostUpdateDto } from './dto/post.update.dto';
import { PostGroup } from '../../post-group/data/post-group.schema';

export class PostRepository {
  private readonly redisPrefixKey = 'post';
  private logger = new Logger('PostRepository');

  constructor(
    @InjectModel(Post.name) private postModel: PaginateModel<Post>,
    private readonly redisService: RedisManagerService,
  ) {}

  async createPost(post: PostCreateDto): Promise<Post | number> {
    try {
      const result = await this.postModel.create(post);
      return result;
    } catch (e) {
      this.logger.error(`Error Occured While [addToPostFromDB] ${e.message}`);
      this.logger.error(e.stack || e);
      if (e.message.includes('E11000')) {
        return HttpStatus.CONFLICT;
      }
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  async modifyPostFromDB(
    userid: string,
    postid: string,
    post: PostUpdateDto,
    // update_Data: object,
  ): Promise<number | Post> {
    try {
      this.logger.debug('modifyPostFromDB.post', post);
      const target = await this.postModel.findById(postid);
      if (!target) {
        return HttpStatus.BAD_REQUEST;
      }

      if (target.owner !== userid) return HttpStatus.UNAUTHORIZED;

      if (post.preview) target.preview = post.preview;
      if (post.dates) target.dates = post.dates;
      if (post.location) target.location = post.location;
      if (post.log) target.log = post.log;
      if (post.outlay) target.outlay = post.outlay;

      if (post.title) target.title = post.title;
      if (post.weather) target.weather = post.weather;
      if (post.groupId) target.groupId = post.groupId;
      const newPost = await target.save();

      this.logger.debug('newPost:', newPost);

      const iKey = `${this.redisPrefixKey}/${newPost.id}`;
      await this.redisService.deleteCache(iKey);

      newPost.readOnlyData as Post;
      return newPost.readOnlyData as Post;
    } catch (e) {
      this.logger.error(`Error Occured While [modifyPostFromDB] ${e.message}`);
      this.logger.error(e.stack || e);
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
  async deletePostFromDB(postid: string, userid: string): Promise<number> {
    const post = await this.postModel.findById(postid);

    if (!post) return HttpStatus.NOT_FOUND;

    if (userid !== post.owner) {
      return HttpStatus.UNAUTHORIZED;
    }

    const key = `${this.redisPrefixKey}/${postid}`;

    await post.delete();
    await this.redisService.deleteCache(key);

    return HttpStatus.OK;
  }

  async getPosts(page_num: number, userid: string): Promise<Post[] | number> {
    const posts = await this.postModel.paginate(
      { owner: userid },
      {
        sort: { createdAt: -1 }, // 최신 순 정렬
        limit: 10, // 개수 제한
        page: page_num, // 페이지 번호
      },
    );
    if (posts['docs'].length == 0) return HttpStatus.NO_CONTENT;

    const lightPosts = [];
    for (let i = 0; i < posts['docs'].length; i++) {
      if (posts['docs'][i].owner !== userid) continue;

      lightPosts.push(posts['docs'][i].lightReadOnlyData);
    }
    return lightPosts;
  }

  async getPost(postid: string, userid: string): Promise<Post | number> {
    const key = `${this.redisPrefixKey}/${postid}`;
    const redisResult = await this.redisService.getCache(key);
    this.logger.log('getPost.redisResult:', !!redisResult);
    this.logger.debug(redisResult);

    if (!!redisResult) {
      return redisResult;
    }

    this.logger.debug(postid);
    const dbResult = await this.postModel.findById(postid);

    this.logger.log(`findById.dbResult: ${!!dbResult}`);
    this.logger.debug(dbResult);
    if (!dbResult) return HttpStatus.NOT_FOUND;

    if (dbResult.owner !== userid) return HttpStatus.UNAUTHORIZED;

    if (!!dbResult) {
      await this.redisService.setCache(key, dbResult);
      return dbResult;
    }

    return HttpStatus.NO_CONTENT;
  }
}
