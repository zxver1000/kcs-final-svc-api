import { UserService } from './user.service';
import { CacheKey, Controller, Get, Param, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'get_user' })
  getUser() {
    return 'OK';
    //    return this.userService.getUser('user/test');
  }

  @Get(':id')
  getUserHttp(@Param('id') userid: string) {
    return this.userService.getUser(userid);
  }

  @Post()
  addUserHttp() {
    return this.userService.setUser('test');
  }
}
