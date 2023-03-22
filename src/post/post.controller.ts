import { Controller, Get, HttpStatus, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { isArray } from 'class-validator';
import { rmSync } from 'fs';
import { SuccessInterceptor } from 'src/common/interceptor/successinterceptor/successinterceptor.interceptor';
import { PostCreateDto } from './data/dto/post.create.dto';
import { Post } from './data/post.schema';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly PostService: PostService) {}

  @UseInterceptors(SuccessInterceptor(HttpStatus.OK))
  @MessagePattern({ cmd: 'get_post' })
  async getPersonalDiary(
    @Payload('PostId') PostId: string,
    @Payload('userid') userid: string,
  ) {
    let result = this.PostService.getPersonalDiary(PostId, userid);

    return result;
  }

  @UseInterceptors(SuccessInterceptor(HttpStatus.OK))
  @MessagePattern({ cmd: 'ListDiary' })
  async ListDiary(
    @Payload('page_num') page_num: number,
    @Payload('userid') userid: string,
  ) {
    return await this.PostService.ListDiary(page_num, userid);
  }

  @UseInterceptors(SuccessInterceptor(HttpStatus.CREATED))
  @MessagePattern({ cmd: 'create_post' })
  async addPersonalDiary(
    @Payload('data') data: PostCreateDto,
    @Payload('userid') userid: string,
  ) {
    console.log('ss');
    console.log(data);
    let result = await this.PostService.addPersonalDiary(data, userid);
    return result;
  }

  @UseInterceptors(SuccessInterceptor(HttpStatus.OK))
  @MessagePattern({ cmd: 'delete_post' })
  async deletePersonalDiary(
    @Payload('postId') postId: string[],
    @Payload('userid') userid: string,
  ) {
    let result = await this.PostService.deletePersonalDiary(postId, userid);

    return result;
  }

  @UseInterceptors(SuccessInterceptor(HttpStatus.OK))
  @MessagePattern({ cmd: 'modify_post' })
  async modifyPersonalDiary(
    @Payload('postid') postId: string,
    @Payload('userid') userid: string,
    @Payload('updateData') updateData: object,
  ) {
    let result = await this.PostService.modifyPostFromDB(
      postId,
      userid,
      updateData,
    );

    return result;
  }
}
