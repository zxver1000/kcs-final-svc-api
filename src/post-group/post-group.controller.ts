import {
  Controller,
  HttpStatus,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MicroserviceDataLogger } from 'src/common/interceptor/logger/logger.interceptor';
import { SuccessInterceptor } from 'src/common/interceptor/successinterceptor/successinterceptor.interceptor';
import { PostGroupCreateDto } from './data/dto/post-group.create.dto';
import { PostGroupUpdateDto } from './data/dto/post-group.update.dto';
import { PostGroupService } from './post-group.service';

@Controller('post-group')
@UseInterceptors(MicroserviceDataLogger('UserController'))
export class PostGroupController {
  private logger = new Logger('PostGroupController');
  constructor(private readonly postGroupService: PostGroupService) {}
  @UseInterceptors(SuccessInterceptor(HttpStatus.OK))
  @MessagePattern({ cmd: 'getPostGroup' })
  async getTrip(
    @Payload('postGroupId') postGroupId: string,
    @Payload('userId') userId: string,
  ) {
    const result = await this.postGroupService.getTrip(postGroupId, userId);
    return result;
  }

  @UseInterceptors(SuccessInterceptor(HttpStatus.OK))
  @MessagePattern({ cmd: 'getPostGroupList' })
  async getTripList(
    @Payload('pageNum') pageNum: number,
    @Payload('userId') userId: string,
  ) {
    const result = await this.postGroupService.ListTrip(pageNum, userId);
    return result;
  }

  @UseInterceptors(SuccessInterceptor(HttpStatus.CREATED))
  @MessagePattern({ cmd: 'addPostGroup' })
  async addPostGroup(
    @Payload('createData') data: PostGroupCreateDto,
    @Payload('userid') userid: string,
  ) {
    const result = await this.postGroupService.addTrip(data, userid);
    return result;
  }
  @UseInterceptors(SuccessInterceptor(HttpStatus.OK))
  @MessagePattern({ cmd: 'getPostGroup' })
  async getPostGroup(
    @Payload('postGroupId') postGroupId: string,
    @Payload('userid') userid: string,
  ) {
    const result = await this.postGroupService.getTrip(postGroupId, userid);
    return result;
  }
  @UseInterceptors(SuccessInterceptor(HttpStatus.OK))
  @MessagePattern({ cmd: 'findPostGroup' })
  async findPostGroup(
    @Payload('postGroupName') postGroupName: string,
    @Payload('userid') userid: string,
  ) {
    this.logger.debug('findPostGroup ', postGroupName);
    const result = await this.postGroupService.findPostGroup(
      postGroupName,
      userid,
    );

    return result;
  }

  @UseInterceptors(SuccessInterceptor(HttpStatus.OK))
  @MessagePattern({ cmd: 'deletePostGroup' })
  async deletePostGroup(
    @Payload('postGroupId') postGroupId: string[],
    @Payload('userid') userid: string,
  ) {
    this.logger.debug('delete postGroupId List', postGroupId);
    const result = await this.postGroupService.deleteTrip(postGroupId, userid);
    return result;
  }
  @UseInterceptors(SuccessInterceptor(HttpStatus.OK))
  @MessagePattern({ cmd: 'deletePostGroupInPost' })
  async deletePostGroupInPost(
    @Payload('postGroupId') postGroupId: string,
    @Payload('userid') userid: string,
    @Payload('posts') posts: string[],
  ) {
    this.logger.debug('delete postGroupId List', postGroupId);
    const result = await this.postGroupService.deletePostGroupInPost(
      postGroupId,
      userid,
      posts,
    );
    return result;
  }
  @UseInterceptors(SuccessInterceptor(HttpStatus.OK))
  @MessagePattern({ cmd: 'modfiyPostGroup' })
  async modifyPostGroup(
    @Payload('userid') userid: string,
    @Payload('updateData') updateData: PostGroupUpdateDto,
  ) {
    this.logger.debug('updateData', updateData);
    const result = await this.postGroupService.modifyTrip(userid, updateData);

    return result;
  }
}
