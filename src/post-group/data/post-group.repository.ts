import { HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { find } from 'rxjs';
import { Post } from '../../post/data/post.schema';
import { RedisManagerService } from '../../redis-manager/redis-manager.service';
import { PostGroupCreateDto } from './dto/post-group.create.dto';
import { PostGroupUpdateDto } from './dto/post-group.update.dto';
import { PostGroup } from './post-group.schema';

export class PostGroupRepository {
  private readonly redisPrefixKey = 'postGroup';
  private logger = new Logger('PostGroupRepository');
  constructor(
    @InjectModel(PostGroup.name)
    private postGroupModel: PaginateModel<PostGroup>,
    private readonly redisService: RedisManagerService,
    @InjectModel(Post.name)
    private postModel: Model<Post>,
  ) {}

  async createPostGroup(
    postGroup: PostGroupCreateDto,
  ): Promise<PostGroup | number> {
    try {
      const result = await this.postGroupModel.create(postGroup);
      return result;
    } catch (e) {
      this.logger.error(
        `Error Occured While [addToPostGroupFromDB] ${e.message}`,
      );
      this.logger.error(e.stack || e);
      if (e.message.includes('E11000')) return HttpStatus.CONFLICT;

      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  async modifyPostGroupfromDB(
    userId: string,
    postGroup: PostGroupUpdateDto,
  ): Promise<number | PostGroup> {
    try {
      this.logger.debug('modifyPostGroupFromDB.post', postGroup);
      const target = await this.postGroupModel.findById(postGroup.id);
      if (!target) {
        return HttpStatus.BAD_REQUEST;
      }
      if (target.owner != userId) return HttpStatus.UNAUTHORIZED;

      if (postGroup.dates) target.dates = postGroup.dates;
      if (postGroup.preview) target.preview = postGroup.preview;
      if (postGroup.title) target.title = postGroup.title;
      //if (postGroup.posts) target.posts = postGroup.posts;

      if (postGroup.posts) {
        for (let i = postGroup.posts.length - 1; i >= 0; i--) {
          let Post = await this.postModel.findById(postGroup.posts[i]);
          if (!Post) continue;

          let findIdx = target.posts.findIndex(
            (e) => String(e._id) === String(Post._id),
          );

          if (findIdx === -1 && Post !== null && Post.owner == userId) {
            //없음 넣어야됨
            target.posts.unshift(Post);
          }
        }
      }

      await target.save();

      this.logger.debug('newPostGroup:', target);
      const iKey = `${this.redisPrefixKey}/${target.id}`;
      await this.redisService.deleteCache(iKey);
      return target.readOnlyData as PostGroup;
    } catch (e) {
      this.logger.error(
        `Error Occured While [modifyPostGroupFromDB] ${e.message}`,
      );
      this.logger.error(e.stack || e);
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  async deletePostGroupFromDB(
    postGroupId: string,
    userId: string,
  ): Promise<number> {
    const postGroup = await this.postGroupModel.findById(postGroupId);
    if (userId !== postGroup.owner) {
      return HttpStatus.UNAUTHORIZED;
    }
    const key = `${this.redisPrefixKey}/${postGroupId}`;
    await postGroup.delete();
    await this.redisService.deleteCache(key);
    return HttpStatus.OK;
  }

  async deletePostGroupInPost(
    postGroupId: string,
    userId: string,
    posts: string[],
  ): Promise<number> {
    const target = await this.postGroupModel.findById(postGroupId);

    if (!target) return HttpStatus.NOT_FOUND;

    if (userId !== target.owner) {
      return HttpStatus.UNAUTHORIZED;
    }

    for (let i = 0; i < posts.length; i++) {
      let Post = await this.postModel.findById(posts[i]);

      if (!Post) continue;
      let findIdx = target.posts.findIndex(
        (e) => String(e._id) === String(Post._id),
      );

      if (findIdx !== -1 && Post.owner === userId) {
        target.posts.splice(findIdx, 1);
      }
    }

    const iKey = `${this.redisPrefixKey}/${postGroupId}`;
    await this.redisService.deleteCache(iKey);
    target.save();
    return HttpStatus.OK;
  }

  async getPostGroups(
    page_num: number,
    userid: string,
  ): Promise<PostGroup[] | number> {
    const postGroups = await this.postGroupModel.paginate(
      { owner: userid },
      {
        sort: { createAt: -1 },
        limit: 10,
        page: page_num,
      },
    );

    if (postGroups['docs'].length == 0) return HttpStatus.NO_CONTENT;

    const PostGroupData = [];
    for (let i = 0; i < postGroups['docs'].length; i++) {
      if (postGroups['docs'][i].owner !== userid) continue;
      PostGroupData.push(postGroups['docs'][i].readOnlyData);
    }
    return PostGroupData;
  }

  async getPostGroup(
    postGroupId: string,
    userid: string,
  ): Promise<PostGroup | number> {
    const key = `${this.redisPrefixKey}/${postGroupId}`;
    const redisResult = await this.redisService.getGroupCache(key);
    this.logger.log('getPostGroup.redisResult:', !!redisResult);
    this.logger.debug(redisResult);

    if (!!redisResult) {
      return redisResult;
    }

    this.logger.debug(postGroupId);
    const dbResult = await this.postGroupModel.findById(postGroupId);
    this.logger.log(`findById.dbResult: ${!!dbResult}`);
    this.logger.debug(dbResult);

    if (dbResult == null) return HttpStatus.NO_CONTENT;

    if (dbResult.owner != userid) return HttpStatus.UNAUTHORIZED;

    if (!!dbResult) {
      await this.redisService.setGroupCache(key, dbResult);
      return dbResult;
    }
    return HttpStatus.NO_CONTENT;
  }
  async findPostGroup(
    postGroupName: string,
    userid: string,
  ): Promise<number | Array<PostGroup>> {
    const result = await this.postGroupModel.find({
      title: { $regex: postGroupName, $options: 'i' },
      owner: userid,
    });

    if (result == null) return HttpStatus.NO_CONTENT;

    const returnValue = [];
    for (let i = 0; i < result.length; i++) {
      returnValue.push(result[i].readOnlyData);
    }
    return returnValue;
  }
}
