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
import { PostService } from './post.service';

@Controller('post')
@UseInterceptors(MicroserviceDataLogger('UserController'))
export class PostController {
  private logger = new Logger('PostController');
  constructor(private readonly PostService: PostService) {}

  @UseInterceptors(SuccessInterceptor(HttpStatus.OK))
  @MessagePattern({ cmd: 'get_post' })
  async getPersonalDiary(
    @Payload('PostId') PostId: string,
    @Payload('userid') userid: string,
  ) {
    const result = await this.PostService.getPersonalDiary(PostId, userid);

    return result;
  }

  @UseInterceptors(SuccessInterceptor(HttpStatus.OK))
  @MessagePattern({ cmd: 'ListDiary' })
  async ListDiary(
    @Payload('pageNum') pageNum: number,
    @Payload('userid') userid: string,
  ) {
    if (!pageNum) pageNum = 1;
    return await this.PostService.ListDiary(pageNum, userid);
  }

  @UseInterceptors(SuccessInterceptor(HttpStatus.CREATED))
  @MessagePattern({ cmd: 'create_post' })
  async addPersonalDiary(
    @Payload('data') data: PostCreateDto,
    @Payload('userid') userid: string,
  ) {
    const result = await this.PostService.addPersonalDiary(data, userid);
    return result;
  }

  @UseInterceptors(SuccessInterceptor(HttpStatus.OK))
  @MessagePattern({ cmd: 'delete_post' })
  async deletePersonalDiary(
    @Payload('postId') postId: string[],
    @Payload('userid') userid: string,
  ) {
    const result = await this.PostService.deletePersonalDiary(postId, userid);

    return result;
  }

  @UseInterceptors(SuccessInterceptor(HttpStatus.OK))
  @MessagePattern({ cmd: 'modify_post' })
  async modifyPersonalDiary(
    @Payload('postid') postId: string,
    @Payload('userid') userid: string,
    @Payload('updateData') updateData: PostCreateDto,
  ) {
    const result = await this.PostService.modifyPostFromDB(
      postId,
      userid,
      updateData,
    );

    return result;
  }
}
