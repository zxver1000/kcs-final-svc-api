import { UserService } from '../../user/user.service';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto } from '../jwt/dto/login.request.dto';
import { UserReadOnly } from 'src/user/data/user.schema';

@Injectable()
export class AuthService {
  //* Email, Password를 통해 로그인 수행
  //* 해당 내용이 DB에 존재하는가, 서로 옳은 내용인가 유효성 검사
  //* 이를 위한 Dependency Injection
  //* JwtService는 auth.module 아래의 JwtModule.register ... 를 통해 사용 가능
  private logger = new Logger('AuthService');
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async jwtLogIn(data: LoginRequestDto) {
    //* 비구조화 할당을 통한 data 정의
    const { email, password } = data;

    const fromUserService =
      await this.userService.getUserByEmailAndPasswordForAuth(
        password,
        data.email,
      );

    if (
      !fromUserService ||
      (!!fromUserService && !fromUserService.success) ||
      (!!fromUserService && !fromUserService.result)
    ) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }

    const user: UserReadOnly = fromUserService.result[0];
    this.logger.debug('jwtLogIn.user: ', user);

    if (typeof user === 'boolean') {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }

    //* JWT 반환
    const payload = {
      email: email,
      sub: user.id,
      nickname: user.nickname,
      profileimage: user.profileimage,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
