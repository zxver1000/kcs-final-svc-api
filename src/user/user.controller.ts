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
  Patch,
  Delete,
  Logger,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from './data/dto/user-create.dto';
import { CurrentUser } from '../common/decorator/user.decorator';
import { UserMicroserviceDto } from './data/dto/user.dto';

@Controller('user')
export class UserController {
  private logger = new Logger('UserController');
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() user: UserMicroserviceDto) {
    if (!user) {
      return new UnauthorizedException('유저 정보를 확인해 주세요.');
    }
    return this.userService.getUserById(user.id);
  }

  @Post('login')
  logIn(@Body() data: LoginRequestDto) {
    return this.authService.jwtLogIn(data);
  }

  @Post('find')
  findUser(@Body('email') email: string) {
    return this.userService.findUser(email);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  updateUser(
    @Body() data: UserCreateDto,
    @CurrentUser() user: UserMicroserviceDto,
  ) {
    if (!user) {
      return new UnauthorizedException('유저 정보를 확인해 주세요.');
    }

    console.log('currentUser:', user);
    return this.userService.modifyUserInformation(data, user.id);
  }

  @Post()
  createUser(@Body() user: UserCreateDto) {
    return this.userService.createUser(user);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  deleteUser(@CurrentUser() user: UserMicroserviceDto) {
    this.logger.debug('controller.deleteUser', user);
    return this.userService.deleteUser(user);
  }
}
