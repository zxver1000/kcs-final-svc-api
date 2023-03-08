import { User } from './data/user.schema';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RedisManagerService } from '../redis-manager/redis-manager.service';
import { UserCreateDto } from './data/dto/user-create.dto';
import { UserRepository } from './data/user.repository';
import { UserMicroserviceDto } from './data/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  private logger = new Logger('UserService');
  constructor(
    private readonly redisService: RedisManagerService,
    private readonly userRepository: UserRepository,
  ) {}
  async getUserById(userid: string): Promise<UserMicroserviceDto | number> {
    console.log('userid', userid);
    const result = await this.userRepository.findById(userid);
    this.logger.log('getUserById.result: ', result);
    if (!result) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
    if (typeof result === 'number') {
      return result;
    }

    if (!!result) {
      return new UserMicroserviceDto(result);
    }
    return HttpStatus.NO_CONTENT;
  }

  async getUserByEmail(email: string): Promise<UserMicroserviceDto | number> {
    const result = await this.userRepository.findByEmail(email);
    this.logger.log('getUserByEmail.result: ', result);
    if (!result) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
    // 따로 번호가 온 경우
    if (typeof result === 'number') {
      return result;
    }

    if (!!result) {
      return new UserMicroserviceDto(result);
    }
    return HttpStatus.NO_CONTENT;
  }

  async getUserByEmailAndPasswordForAuth(
    password: string,
    email: string,
  ): Promise<UserMicroserviceDto | number> {
    const result = await this.userRepository.findByEmail(email);
    this.logger.log('getUserByEmail.result: ', result);

    if (!result) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
    // 따로 번호가 온 경우
    if (typeof result === 'number') {
      return result;
    }

    if (!!result) {
      //* 비밀번호 검사
      //* 이미 user 안에는 password가 있다.
      //* 실제로는 front에서 아예 해시화 하여 비교
      const isPasswordValidated: boolean = await bcrypt.compare(
        password,
        result.password,
      );

      if (isPasswordValidated) {
        return new UserMicroserviceDto(result);
      }

      return HttpStatus.UNAUTHORIZED;
    }
    return HttpStatus.NO_CONTENT;
  }

  async createUser(user: UserCreateDto): Promise<UserMicroserviceDto | number> {
    const { email, nickname, password } = user;
    const isUserExist = await this.userRepository.findByEmail(email);

    if (isUserExist) {
      this.logger.log(`User [Email: ${email}] already exists`);
      return HttpStatus.CONFLICT;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await this.userRepository.create({
      email,
      nickname,
      password: hashedPassword,
    });

    if (!result) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
    if (typeof result === 'number') {
      return result;
    }

    if (!!result) {
      return new UserMicroserviceDto(result);
    }
    return HttpStatus.CONFLICT;
  }

  async logIn() {}
  async signUp() {}
  async modifyUserInformation() {}

  async findPassword() {}
  async showMyPage(userid: string) {}
}
