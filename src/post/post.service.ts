import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PostCreateDto } from './data/dto/post.create.dto';
import { PostUpdateDto } from './data/dto/post.update.dto';
import { deserializePostText } from './data/modules/post.text';
import { PostRepository } from './data/post.repository';
import { Post } from './data/post.schema';

@Injectable()
export class PostService {
  private logger = new Logger('PostService');
  constructor(private readonly postRepository: PostRepository) {}

  async modifyPostFromDB(
    postid: string,
    userid: string,
    updateData: PostUpdateDto,
  ): Promise<number | Post> {
    try {
      this.logger.debug('modifyPostFromDB.updateData', updateData);
      const result = await this.postRepository.modifyPostFromDB(
        userid,
        postid,
        updateData,
      );
      this.logger.debug('modifyPostFromDB.result', result);

      if (!result) {
        this.logger.error('modifyPostFromDB:: Internal Server Error Occured');
        return HttpStatus.INTERNAL_SERVER_ERROR;
      }
      if (typeof result === 'number') return result;
      if (!!result) {
        if (result.readOnlyData) {
          return result.readOnlyData as Post;
        }
        return result;
      }

      this.logger.error(
        'modifyPostFromDB:: Cannot get any result from PostRepository.update',
      );
      return HttpStatus.NO_CONTENT;
    } catch (e) {
      this.logger.error(e.stack || e);
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  async addPersonalDiary(
    post: PostCreateDto,
    userid: string,
  ): Promise<number | Post> {
    try {
      post.owner = userid;

      for (let i = 0; i < post.log?.length; i++) {
        const log = deserializePostText(post.log[i]);
        log.setOwner(userid);
        post.log[i] = log;
      }

      const result = await this.postRepository.createPost(post);

      if (typeof result === 'number') {
        return result;
      }

      if (!!result) {
        return result.readOnlyData as Post;
      }
    } catch (e) {
      this.logger.error(e.stack || e);
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
  async getPersonalDiary(
    postid: string,
    userid: string,
  ): Promise<number | Post> {
    try {
      const result = await this.postRepository.getPost(postid, userid);
      if (typeof result === 'number') {
        return result;
      }
      if (!!result) {
        return result.readOnlyData as Post;
      }
    } catch (e) {
      this.logger.error(e.stack || e);
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
  async ListDiary(
    pageNum: number,
    userid: string,
  ): Promise<number | Array<Post>> {
    if (!pageNum || isNaN(pageNum)) return HttpStatus.BAD_REQUEST;

    try {
      const result = this.postRepository.getPosts(pageNum, userid);

      return result;
    } catch (e) {
      this.logger.error(e.stack || e);
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  async deletePersonalDiary(
    postIds: string[],
    userid: string,
  ): Promise<number> {
    try {
      for (let i = 0; i < postIds.length; i++) {
        const post = await this.postRepository.getPost(postIds[i], userid);
        if (typeof post != 'number') {
          const result = await this.postRepository.deletePostFromDB(
            post.id,
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
