import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { UserMicroserviceDataWrapper } from 'src/common/data/user.microservice.dto';
import { PostGroupUpdateDto } from './data/dto/post-group.update.dto';

@Injectable()
export class PostGroupService {
  private logger = new Logger('PostGroupService');
  private gatewayTimeout: number;
  constructor(
    @Inject('MS-Post')
    private readonly userClient: ClientProxy,
  ) {
    //* ms
    this.gatewayTimeout = Number(process.env.GatewayTimeout) || 5000;
    if (isNaN(this.gatewayTimeout)) this.gatewayTimeout = 5000;
  }
  async deletePostGroup(
    postGroupId: string[],
    userid: string,
  ): Promise<UserMicroserviceDataWrapper | number> {
    const result = await lastValueFrom(
      this.userClient
        .send(
          {
            cmd: 'deletePostGroup',
          },
          {
            postGroupId,
            userid,
          },
        )
        .pipe(timeout(this.gatewayTimeout)),
    );
    if (!result) {
      throw new InternalServerErrorException();
    }

    if (!result.success) {
      if (result.code >= 400) {
        throw new HttpException(HttpStatus[result.code], result.code);
      }
    }
    return result;
  }

  async deletePostGroupInPost(
    postGroupId: string,
    userid: string,
    posts: string[],
  ): Promise<UserMicroserviceDataWrapper | number> {
    const result = await lastValueFrom(
      this.userClient
        .send(
          {
            cmd: 'deletePostGroupInPost',
          },
          {
            postGroupId,
            userid,
            posts,
          },
        )
        .pipe(timeout(this.gatewayTimeout)),
    );
    if (!result) {
      throw new InternalServerErrorException();
    }

    if (!result.success) {
      if (result.code >= 400) {
        throw new HttpException(HttpStatus[result.code], result.code);
      }
    }
    return result;
  }

  async addTrip(
    createData: object,
    userid: string,
  ): Promise<UserMicroserviceDataWrapper | number> {
    const result = await lastValueFrom(
      this.userClient
        .send(
          {
            cmd: 'addPostGroup',
          },
          {
            createData,
            userid,
          },
        )
        .pipe(timeout(this.gatewayTimeout)),
    );
    if (!result) {
      throw new InternalServerErrorException();
    }

    if (!result.success) {
      if (result.code >= 400) {
        throw new HttpException(HttpStatus[result.code], result.code);
      }
    }
    return result;
  }

  async getTrip(
    postGroupId: string,
    userid: string,
  ): Promise<UserMicroserviceDataWrapper | number> {
    const result = await lastValueFrom(
      this.userClient
        .send(
          {
            cmd: 'getPostGroup',
          },
          {
            postGroupId,
            userid,
          },
        )
        .pipe(timeout(this.gatewayTimeout)),
    );
    if (!result) {
      throw new InternalServerErrorException();
    }

    if (!result.success) {
      if (result.code >= 400) {
        throw new HttpException(HttpStatus[result.code], result.code);
      }
    }
    return result;
  }

  async getTripList(
    pageNum: number,
    userId: string,
  ): Promise<UserMicroserviceDataWrapper | number> {
    const result = await lastValueFrom(
      this.userClient
        .send(
          {
            cmd: 'getPostGroupList',
          },
          {
            pageNum,
            userId,
          },
        )
        .pipe(timeout(this.gatewayTimeout)),
    );
    if (!result) {
      throw new InternalServerErrorException();
    }

    if (!result.success) {
      if (result.code >= 400) {
        throw new HttpException(HttpStatus[result.code], result.code);
      }
    }
    return result;
  }
  async modifyTrip(
    updateData: PostGroupUpdateDto,
    userid: string,
  ): Promise<UserMicroserviceDataWrapper | number> {
    const result = await lastValueFrom(
      this.userClient
        .send(
          {
            cmd: 'modfiyPostGroup',
          },
          {
            updateData,
            userid,
          },
        )
        .pipe(timeout(this.gatewayTimeout)),
    );
    if (!result) {
      throw new InternalServerErrorException();
    }

    if (!result.success) {
      if (result.code >= 400) {
        throw new HttpException(HttpStatus[result.code], result.code);
      }
    }
    return result;
  }

  async findPostGroup(
    postGroupName: string,
    userid: string,
  ): Promise<UserMicroserviceDataWrapper | number> {
    const result = await lastValueFrom(
      this.userClient
        .send(
          {
            cmd: 'findPostGroup',
          },
          {
            postGroupName,
            userid,
          },
        )
        .pipe(timeout(this.gatewayTimeout)),
    );
    if (!result) {
      throw new InternalServerErrorException();
    }

    if (!result.success) {
      if (result.code >= 400) {
        throw new HttpException(HttpStatus[result.code], result.code);
      }
    }
    return result;
  }
}
