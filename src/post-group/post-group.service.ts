import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PostCreateDto } from 'src/post/data/dto/post.create.dto';
import { PostGroupCreateDto } from './data/dto/post-group.create.dto';
import { PostGroupUpdateDto } from './data/dto/post-group.update.dto';
import { PostGroupRepository } from './data/post-group.repository';
import { PostGroup } from './data/post-group.schema';

@Injectable()
export class PostGroupService {
  private logger = new Logger('PostService');

  constructor(private readonly postGroupRepository: PostGroupRepository) {}

  async modifyTrip(
    userId: string,
    updateData: PostGroupUpdateDto,
  ): Promise<number | PostGroup> {
    try {
      this.logger.debug('modifyPostGroupFromDB.updateData', updateData);

      const result = await this.postGroupRepository.modifyPostGroupfromDB(
        userId,
        updateData,
      );

      this.logger.debug('modifyPostGroupFromDB.result', result);

      if (!result) {
        this.logger.error(
          'modifyPostGroupFromDB:: Internal Server Error Occured',
        );
        return HttpStatus.INTERNAL_SERVER_ERROR;
      }
      if (typeof result === 'number') return result;
      if (!!result) {
        if (result.readOnlyData) {
          return result.readOnlyData as PostGroup;
        }
        return result;
      }

      this.logger.error(
        'modifyPostGroupFromDB:: Cannot get any result from PostGroupRepository.update',
      );
      return HttpStatus.NO_CONTENT;
    } catch (e) {
      this.logger.error(e.stack || e);
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  async addTrip(
    createData: PostGroupCreateDto,
    userId: string,
  ): Promise<number | PostGroup> {
    try {
      createData.owner = userId;
      const result = await this.postGroupRepository.createPostGroup(createData);
      if (typeof result === 'number') return result;

      if (!!result) return result.readOnlyData as PostGroup;
    } catch (e) {
      this.logger.error(e.stack || e);
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
  async getTrip(
    postGroupId: string,
    userId: string,
  ): Promise<number | PostGroup> {
    try {
      const result = await this.postGroupRepository.getPostGroup(
        postGroupId,
        userId,
      );
      if (typeof result === 'number') return result;

      if (!!result) return result.readOnlyData as PostGroup;
    } catch (e) {
      this.logger.error(e.stack || e);
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  async ListTrip(
    pageNum: number,
    userId: string,
  ): Promise<number | Array<PostGroup>> {
    if (!pageNum || isNaN(pageNum)) return HttpStatus.BAD_REQUEST;

    try {
      const result = this.postGroupRepository.getPostGroups(pageNum, userId);
      return result;
    } catch (e) {
      this.logger.error(e.stack || e);
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  async deleteTrip(postGroupIds: string[], userId: string): Promise<number> {
    try {
      for (let i = 0; i < postGroupIds.length; i++) {
        const postGroup = await this.postGroupRepository.getPostGroup(
          postGroupIds[i],
          userId,
        );
        if (typeof postGroup !== 'number') {
          const result = await this.postGroupRepository.deletePostGroupFromDB(
            postGroup.id,
            userId,
          );
        }
      }
      return HttpStatus.OK;
    } catch (e) {
      this.logger.error(e.stack || e);
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
  async findPostGroup(
    findGroupName: string,
    userId: string,
  ): Promise<number | Array<PostGroup>> {
    try {
      const result = this.postGroupRepository.findPostGroup(
        findGroupName,
        userId,
      );
      if (typeof result === 'number') return result;

      return result;
    } catch (e) {
      this.logger.error(e.stack || e);
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
