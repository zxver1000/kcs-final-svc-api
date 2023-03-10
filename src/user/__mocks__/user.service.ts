import {
  mockUserMicroserviceCreateDataStub,
  mockUserMicroserviceDto,
} from '../test/stubs/user.microservice.dto';

export const UserService = jest.fn().mockReturnValue({
  getUserById: jest.fn().mockResolvedValue(mockUserMicroserviceDto),
  createUser: jest.fn().mockResolvedValue(mockUserMicroserviceCreateDataStub()),
});
