import { UserCreateDto } from '../../data/dto/user-create.dto';
import { LoginRequestDto } from '../../../auth/jwt/dto/login.request.dto';
import { UserMicroserviceDataWrapper } from '../../../common/data/user.microservice.dto';
import { UserMicroserviceDto } from '../../data/dto/user.dto';
import { HttpStatus } from '@nestjs/common';

export const mockJwt = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
};

export const mockUserLoginDto: LoginRequestDto = {
  email: 'test@email.com',
  password: 'test-password',
};

export const mockUserCreateDto: UserCreateDto = {
  email: 'test@email.com',
  password: 'test-password',
  nickname: 'test-nickname',
};

export const mockUserMicroserviceDto: UserMicroserviceDto = {
  id: 'test-id',
  email: 'test-email',
  nickname: 'test-nickname',
  profileimage: 'test-profile',
  password: 'test-password',
};

//* 실제론 위 자료형으로 가능하지만, 나는 microservice 통신을 통해 MicroserviceDataWrapper 형식을 가져오기 때문에
//* 아래와 같은 형태를 만들어 줌
export const mockUserMicroserviceCreateDataStub =
  (): UserMicroserviceDataWrapper => {
    return {
      success: true,
      code: HttpStatus.CREATED,
      result: [mockUserMicroserviceDto],
    };
  };
