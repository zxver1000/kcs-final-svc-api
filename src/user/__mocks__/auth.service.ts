import { mockJwt } from '../test/stubs/user.microservice.dto';

export const AuthService = jest.fn().mockReturnValue({
  jwtLogIn: jest.fn().mockResolvedValue(mockJwt),
});
