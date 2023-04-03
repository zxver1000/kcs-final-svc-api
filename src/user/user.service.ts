import { UserMicroserviceDataWrapper } from '../common/data/user.microservice.dto';
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
import {
  ResetPasswordDto,
  UserCreateDto,
  UserPasswordDto,
} from './data/dto/user-create.dto';
import { UserReadOnly } from './data/user.schema';

@Injectable()
export class UserService {
  private logger = new Logger('UserService');
  private gatewayTimeout: number;
  constructor(
    @Inject('MS-User')
    private readonly userClient: ClientProxy,
  ) {
    //* ms
    this.gatewayTimeout = Number(process.env.GatewayTimeout) || 5000;
    if (isNaN(this.gatewayTimeout)) this.gatewayTimeout = 5000;
  }

  async getUserById(
    userid: string,
  ): Promise<UserMicroserviceDataWrapper | null> {
    const result = await lastValueFrom(
      this.userClient
        .send(
          {
            cmd: 'read_user',
          },
          {
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

  async getUser(body): Promise<UserMicroserviceDataWrapper | null> {
    const result = await lastValueFrom(
      this.userClient
        .send(
          {
            cmd: 'read_user',
          },
          body,
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

    if (body.nickname) {
      return {
        success: result.success,
        code: result.code,
      };
    }

    return result;
  }

  async getUserByEmail(email: string): Promise<UserMicroserviceDataWrapper> {
    const result = await lastValueFrom(
      this.userClient
        .send(
          {
            cmd: 'read_user_by_email',
          },
          {
            email,
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

  async getUserByEmailAndPasswordForAuth(
    password: string,
    email: string,
  ): Promise<UserMicroserviceDataWrapper> {
    const result = await lastValueFrom(
      this.userClient
        .send(
          {
            cmd: 'auth_user',
          },
          {
            password,
            email,
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

  //* Create
  async createUser(user: UserCreateDto): Promise<UserMicroserviceDataWrapper> {
    const result = await lastValueFrom(
      this.userClient
        .send(
          {
            cmd: 'create_user',
          },
          {
            user,
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

    this.logger.debug('createUser.result:', result);

    return result;
  }

  async verifyEmail(message: string): Promise<UserMicroserviceDataWrapper> {
    const result = await lastValueFrom(
      this.userClient
        .send(
          {
            cmd: 'verify_user',
          },
          {
            message,
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

  async deleteUser(user: UserReadOnly): Promise<UserMicroserviceDataWrapper> {
    const result = await lastValueFrom(
      this.userClient
        .send(
          {
            cmd: 'delete_user',
          },
          {
            user,
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

  async modifyUserInformation(
    user: UserCreateDto,
    userid: string,
  ): Promise<UserMicroserviceDataWrapper> {
    const result = await lastValueFrom(
      this.userClient
        .send(
          {
            cmd: 'update_user',
          },
          {
            user,
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

  async updateUserPassword(
    user: UserPasswordDto,
    userid: string,
  ): Promise<UserMicroserviceDataWrapper> {
    const result = await lastValueFrom(
      this.userClient
        .send(
          {
            cmd: 'update_password',
          },
          {
            user,
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

  async resetUserPassword(
    user: ResetPasswordDto,
  ): Promise<UserMicroserviceDataWrapper> {
    const result = await lastValueFrom(
      this.userClient
        .send(
          {
            cmd: 'reset_password',
          },
          {
            user,
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

  async findUser(email: string): Promise<UserMicroserviceDataWrapper> {
    const result = await lastValueFrom(
      this.userClient
        .send({ cmd: 'find_password' }, { email })
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

  async findNickname(nickname: string): Promise<UserMicroserviceDataWrapper> {
    const result = await lastValueFrom(
      this.userClient
        .send({ cmd: 'read_nickname' }, { nickname })
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

    return {
      success: result.success,
      code: result.code,
    };
  }
}
