import { mockJwt } from '../../user/test/stubs/user.microservice.dto';

export const AuthService = jest.fn().mockReturnValue({
  jwtLogIn: jest.fn().mockImplementation((data) => {
    console.log('data: ', data);
    return mockJwt;
  }), //.mockResolvedValue(mockJwt),
});
