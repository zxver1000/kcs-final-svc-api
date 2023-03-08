import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserCreateDto } from './data/dto/user-create.dto';
import { UserMicroserviceDto } from './data/dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'read_user' })
  getUser(@Payload('id') id: string) {
    return 'OK';
    //    return this.userService.getUser('user/test');
  }

  @MessagePattern({ cmd: 'create_user' })
  createUser(@Payload('user') user: UserCreateDto) {
    return 'OK';
    //    return this.userService.getUser('user/test');
  }

  @MessagePattern({ cmd: 'update_user' })
  updateUser(@Payload('user') user: UserCreateDto) {
    return 'OK';
    //    return this.userService.getUser('user/test');
  }

  @MessagePattern({ cmd: 'delete_user' })
  deleteUser(@Payload('user') user: UserMicroserviceDto) {
    return 'OK';
    //    return this.userService.getUser('user/test');
  }
}
