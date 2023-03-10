import { UserMicroserviceDataWrapper } from '../../common/data/user.microservice.dto';
import { AuthService } from '../../auth/service/auth.service';
import { AuthService as MockAuthService } from '../__mocks__/auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { JwtService } from '@nestjs/jwt';
import {
  mockJwt,
  mockUserCreateDto,
  mockUserLoginDto,
  mockUserMicroserviceCreateDataStub,
} from './stubs/user.microservice.dto';

//* 필요한 Mock Data
//* UserMicroserviceDto
jest.mock('../user.service');

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: 'MS-User',
            transport: Transport.TCP,
            options: {
              host: process.env.UserHost,
              port: Number(process.env.UserPort),
            },
          },
        ]),
      ],
      controllers: [UserController],
      providers: [
        UserService,
        JwtService,
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
      ],
    }).compile();

    controller = moduleRef.get<UserController>(UserController);
    service = moduleRef.get<UserService>(UserService);
    authService = moduleRef.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe('getCurrentUser', () => {
    describe('when getCurrentUser is called', () => {
      test('then it should be guarded with JwtAuthGuard', () => {
        const guards = Reflect.getMetadata(
          '__guards__',
          UserController.prototype.getCurrentUser,
        );
        const guard = new guards[0]();

        expect(guard).toBeInstanceOf(JwtAuthGuard);
      });
    });
  });

  describe('logIn', () => {
    describe('when logIn is called', () => {
      let token: object;

      beforeEach(async () => {
        token = await controller.logIn(mockUserLoginDto);
      });

      test('then it should call authService.jwtLogIn', () => {
        expect(authService.jwtLogIn).toBeCalledWith(mockUserLoginDto);
      });

      test('then it should return a token', () => {
        expect(token).toEqual(mockJwt);
      });
    });
  });

  describe('createUser', () => {
    let user: UserMicroserviceDataWrapper;

    beforeEach(async () => {
      user = await controller.createUser(mockUserCreateDto);
    });

    test('then it should call service.createUser', async () => {
      console.log(service);
      expect(service.createUser).toBeCalledWith(mockUserCreateDto);
    });

    test('then it should return a user', () => {
      expect(user).toEqual(mockUserMicroserviceCreateDataStub());
    });
  });
});
