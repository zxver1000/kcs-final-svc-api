import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserCreateDTo } from '../dto/UserCreateDTO';
import { UserService } from '../service/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'get_user' })
  getUser() {
    return 'OK';
    //    return this.userService.getUser('user/test');
  }
  @Get()
  async hi() {
    const result = await this.userService.get_DB('ss@4');
    console.log('hihi');
    return result;
  }
  @Get('showMyPage')
  async showMyPage() {
    const result = await this.userService.showMyPage('hihi');
    console.log(result);
    console.log('result 반환');
    return result;
  }

  @Post()
  async createuser(@Body() userCreateDto: UserCreateDTo) {
    await this.userService.createusers(userCreateDto);
    return '생성완료';
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
