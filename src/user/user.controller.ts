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
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto, UserPasswordDto } from './data/dto/user-create.dto';
import { CurrentUser } from '../common/decorator/user.decorator';
import { UserReadOnly } from './data/user.schema';

@Controller('user')
export class UserController {
  private logger = new Logger('UserController');
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async logIn(@Body() data: LoginRequestDto) {
    const result = await this.authService.jwtLogIn(data);
    this.logger.debug('login result', result);
    return result;
  }

  @Post('find')
  async findUser(@Body('email') email: string) {
    return await this.userService.findUser(email);
  }

  @Get('nickname/:nickname')
  async findNickname(@Param('nickname') nickname: string) {
    return await this.userService.findNickname(nickname);
  }

  @Post()
  async createUser(@Body() user: UserCreateDto) {
    return await this.userService.createUser(user);
  }

  @Get('verifyEmail/:message')
  async verifyEmail(@Param('message') encryptedMessage: string) {
    this.logger.debug('verifyEmail:', encryptedMessage);
    return await this.userService.verifyEmail(encryptedMessage);
  }

  //* Guard Section
  @Get()
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() user: UserReadOnly) {
    if (!user) {
      return new UnauthorizedException('유저 정보를 확인해 주세요.');
    }
    return await this.userService.getUserById(user.id);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateUser(@Body() data) {
    this.logger.debug('updateUser.data: ', data);
    return await this.userService.modifyUserInformation(data.user, data.userid);
  }

  @Patch('secret')
  @UseGuards(JwtAuthGuard)
  async updatePassword(@Body() data, @CurrentUser() user) {
    this.logger.debug('updatePassword.data: ', data, 'user:', user);
    return await this.userService.updateUserPassword(data.user, user.id);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteUser(@CurrentUser() user: UserReadOnly) {
    this.logger.debug('controller.deleteUser', user);
    return await this.userService.deleteUser(user);
  }
}
