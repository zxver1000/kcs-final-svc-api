import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { AuthService } from '../auth/service/auth.service';
import { CurrentUser } from '../common/decorator/user.decorator';
import { PostCreateDto } from './data/dto/post.create.dto';
import { PostUpdateDto } from './data/dto/post.update.dto';

import { PostService } from './post.service';

@Controller('post')
export class PostController {
  private logger = new Logger('PostController');
  constructor(private readonly postService: PostService) {}

  @Get(':postid')
  @UseGuards(JwtAuthGuard)
  async getPost(@Param('postid') postid: string, @CurrentUser() user) {
    return this.postService.getPersonalDiary(postid, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getPosts(@CurrentUser() user, @Query('pagenum') pagenum: number) {
    return await this.postService.listDiaries(pagenum, user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addPersonalDiary(@CurrentUser() user, @Body() data) {
    this.logger.debug('addPersonalDiary.user:', user);
    if (!user) {
      return new UnauthorizedException('유저 정보를 확인해 주세요.');
    }
    this.logger.debug('addPersonalDiary.data:', data);

    return await this.postService.addPersonalDiary(data, user.id);
  }
  @Delete()
  @UseGuards(JwtAuthGuard)
  async deletePersonalDiary(
    @CurrentUser() user,
    @Body('postid') postId: string[],
  ) {
    if (!user) {
      return new UnauthorizedException('유저 정보를 확인해 주세요.');
    }

    return await this.postService.deletePersonalDiary(postId, user.id);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async modifyPersonalDiary(@CurrentUser() user, @Body() data) {
    if (!user) {
      return new UnauthorizedException('유저 정보를 확인해 주세요.');
    }
    this.logger.debug('modifyPersonalDiary.data', data);
    return await this.postService.modifyPersonalDiary(data.id, user.id, data);
  }
}
