import { JwtAuthGuard } from './../auth/jwt/jwt.guard';
import { AuthService } from './../auth/service/auth.service';
import { LoginRequestDto } from './../auth/jwt/dto/login.request.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from './data/dto/user-create.dto';
import { CurrentUser } from '../common/decorator/user.decorator';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() user) {
    if (!user) {
      return new UnauthorizedException('유저 정보를 확인해 주세요.');
    }
    return this.userService.getUserById(user.id);
  }

  @Post('login')
  logIn(@Body() data: LoginRequestDto) {
    return this.authService.jwtLogIn(data);
  }

  @Post()
  createUser(@Body() user: UserCreateDto) {
    return this.userService.createUser(user);
  }
}
