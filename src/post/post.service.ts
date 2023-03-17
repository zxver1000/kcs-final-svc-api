import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { UserMicroserviceDataWrapper } from 'src/common/data/user.microservice.dto';
import { PostCreateDto } from './data/dto/post.createDto';
@Injectable()
export class PostService {
  private gatewayTimeout: number;
  constructor(
    @Inject('MS-Post')
    private readonly userClient: ClientProxy,
  ) {
    //* ms
    this.gatewayTimeout = Number(process.env.GatewayTimeout) || 5000;
    if (isNaN(this.gatewayTimeout)) this.gatewayTimeout = 5000;
  }
  async modifyPostFromDB(
    PostId: string,
    userid: string,
    updateData: object,
  ): Promise<UserMicroserviceDataWrapper | null> {
    const result = await lastValueFrom(
      this.userClient
        .send(
          {
            cmd: 'modify_post',
          },
          {
            PostId,
            userid,
            updateData,
          },
        )
        .pipe(timeout(this.gatewayTimeout)),
    );

    return result;
  }

  async listDiaries(
    page_num: number,
    userid: string,
  ): Promise<UserMicroserviceDataWrapper | number> {
    const result = await lastValueFrom(
      this.userClient
        .send(
          {
            cmd: 'ListDiary',
          },
          {
            page_num,
            userid,
          },
        )
        .pipe(timeout(this.gatewayTimeout)),
    );

    return result;
  }

  async getPersonalDiary(
    PostId: string,
    userid: string,
  ): Promise<UserMicroserviceDataWrapper | number> {
    const result = await lastValueFrom(
      this.userClient
        .send(
          {
            cmd: 'get_post',
          },
          {
            PostId,
            userid,
          },
        )
        .pipe(timeout(this.gatewayTimeout)),
    );

    return result;
  }
  async addPersonalDiary(data: object, userid: string) {
    const result = await lastValueFrom(
      this.userClient
        .send(
          {
            cmd: 'create_post',
          },
          {
            data,
            userid,
          },
        )
        .pipe(timeout(this.gatewayTimeout)),
    );

    return result;
  }
  async deletePersonalDiary(postId: string[], userid: string) {
    const result = await lastValueFrom(
      this.userClient
        .send(
          {
            cmd: 'delete_post',
          },
          {
            postId,
            userid,
          },
        )
        .pipe(timeout(this.gatewayTimeout)),
    );

    return result;
  }
  async modifyPersonalDiary(
    postid: string,
    userid: string,
    updateData: object,
  ) {
    const result = await lastValueFrom(
      this.userClient
        .send(
          {
            cmd: 'modify_post',
          },
          {
            postid,
            userid,
            updateData,
          },
        )
        .pipe(timeout(this.gatewayTimeout)),
    );

    return result;
  }
}
