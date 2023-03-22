import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
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

import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':postid')
  @UseGuards(JwtAuthGuard)
  async getPost(@CurrentUser() user, @Param('postid') postid: string) {
    if (!user) {
      return new UnauthorizedException('유저 정보를 확인해 주세요.');
    }

    return this.postService.getPersonalDiary(postid, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getPosts(
    @CurrentUser() user,
    @Req() data: Request,
    @Query('pagenum') pagenum: number,
  ) {
    if (!user) {
      return new UnauthorizedException('유저 정보를 확인해 주세요.');
    }

    return await this.postService.listDiaries(pagenum, user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addPersonalDiary(@CurrentUser() user, @Body() data: object) {
    if (!user) {
      return new UnauthorizedException('유저 정보를 확인해 주세요.');
    }

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
  async modifyPersonalDiary(
    @CurrentUser() user,
    @Body('postid') postid: string,
    @Body('data') data: object,
  ) {
    if (!user) {
      return new UnauthorizedException('유저 정보를 확인해 주세요.');
    }
    return await this.postService.modifyPersonalDiary(postid, user.id, data);
  }
}
