import {
  Controller,
  HttpStatus,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MicroserviceDataLogger } from 'src/common/interceptor/logger/logger.interceptor';
import { SuccessInterceptor } from 'src/common/interceptor/successinterceptor/successinterceptor.interceptor';
import { PostCreateDto } from './data/dto/post.create.dto';
import { PostUpdateDto } from './data/dto/post.update.dto';
import { PostService } from './post.service';

@Controller('post')
@UseInterceptors(MicroserviceDataLogger('UserController'))
export class PostController {
  private logger = new Logger('PostController');
  constructor(private readonly postService: PostService) {}

  @UseInterceptors(SuccessInterceptor(HttpStatus.OK))
  @MessagePattern({ cmd: 'get_post' })
  async getPersonalDiary(
    @Payload('postid') postid: string,
    @Payload('userid') userid: string,
  ) {
    const result = await this.postService.getPersonalDiary(postid, userid);

    return result;
  }

  @UseInterceptors(SuccessInterceptor(HttpStatus.OK))
  @MessagePattern({ cmd: 'ListDiary' })
  async ListDiary(
    @Payload('pageNum') pageNum: number,
    @Payload('userid') userid: string,
  ) {
    if (!pageNum) pageNum = 1;
    return await this.postService.ListDiary(pageNum, userid);
  }

  @UseInterceptors(SuccessInterceptor(HttpStatus.CREATED))
  @MessagePattern({ cmd: 'create_post' })
  async addPersonalDiary(
    @Payload('data') data: PostCreateDto,
    @Payload('userid') userid: string,
  ) {
    const result = await this.postService.addPersonalDiary(data, userid);
    return result;
  }

  @UseInterceptors(SuccessInterceptor(HttpStatus.OK))
  @MessagePattern({ cmd: 'delete_post' })
  async deletePersonalDiary(
    @Payload('postid') postid: string[],
    @Payload('userid') userid: string,
  ) {
    const result = await this.postService.deletePersonalDiary(postid, userid);

    return result;
  }

  @UseInterceptors(SuccessInterceptor(HttpStatus.OK))
  @MessagePattern({ cmd: 'modify_post' })
  async modifyPersonalDiary(
    @Payload('postid') postid: string,
    @Payload('userid') userid: string,
    @Payload('updateData') updateData: PostUpdateDto,
  ) {
    this.logger.debug('updateData', updateData);
    const result = await this.postService.modifyPostFromDB(
      postid,
      userid,
      updateData,
    );

    return result;
  }
}
