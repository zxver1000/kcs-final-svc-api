import { UserMicroserviceDataWrapper } from './../common/data/user.microservice.dto';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { UserCreateDto } from './data/dto/user-create.dto';
import { User } from './data/user.schema';

@Injectable()
export class UserService {
  private gatewayTimeout: number;
  constructor(
    @Inject('MS-User')
    private readonly userClient: ClientProxy,
  ) {
    //* ms
    this.gatewayTimeout = Number(process.env.GatewayTimeout) || 5000;
    if (isNaN(this.gatewayTimeout)) this.gatewayTimeout = 5000;
  }

  getUser() {
    return this.userClient
      .send(
        {
          cmd: 'read_user',
        },
        {},
      )
      .pipe(timeout(this.gatewayTimeout));
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

    console.log('auth result', result);

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

    return result;
  }
}
