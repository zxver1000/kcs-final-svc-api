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
import { UserMicroserviceDataWrapper } from '../common/data/user.microservice.dto';

@Injectable()
export class PostService {
  private logger = new Logger('PostService');
  private gatewayTimeout: number;
  constructor(
    @Inject('MS-Post')
    private readonly userClient: ClientProxy,
  ) {
    //* ms
    this.gatewayTimeout = Number(process.env.GatewayTimeout) || 5000;
    if (isNaN(this.gatewayTimeout)) this.gatewayTimeout = 5000;
  }

  async listDiaries(
    pageNum: number,
    userid: string,
  ): Promise<UserMicroserviceDataWrapper | number> {
    const result = await lastValueFrom(
      this.userClient
        .send(
          {
            cmd: 'ListDiary',
          },
          {
            pageNum,
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

  async getPersonalDiary(
    postid: string,
    userid: string,
  ): Promise<UserMicroserviceDataWrapper | number> {
    const result = await lastValueFrom(
      this.userClient
        .send(
          {
            cmd: 'get_post',
          },
          {
            postid,
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
  async addPersonalDiary(
    data: object,
    userid: string,
  ): Promise<UserMicroserviceDataWrapper | number> {
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
  async deletePersonalDiary(
    postid: string[],
    userid: string,
  ): Promise<UserMicroserviceDataWrapper | number> {
    const result = await lastValueFrom(
      this.userClient
        .send(
          {
            cmd: 'delete_post',
          },
          {
            postid,
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

  async modifyPersonalDiary(
    postid: string,
    userid: string,
    updateData: object,
  ) {
    this.logger.debug('updateData:', updateData);
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
