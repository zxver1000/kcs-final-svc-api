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
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { AuthService } from 'src/auth/service/auth.service';
import { CurrentUser } from 'src/common/decorator/user.decorator';
import { LightPostDto } from './data/dto/LightPostDto';
import { PostCreateDto } from './data/dto/post.createDto';

import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(
    private readonly PostService: PostService,
    private readonly authService: AuthService,
  ) {}

  @Get(':data')
  @UseGuards(JwtAuthGuard)
  async getPost(@CurrentUser() user, @Param('data') data: string) {
    if (!user) {
      return new UnauthorizedException('유저 정보를 확인해 주세요.');
    }

    return this.PostService.getPersonalDiary(data, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getPosts(@CurrentUser() user, @Req() data: Request) {
    if (!user) {
      return new UnauthorizedException('유저 정보를 확인해 주세요.');
    }

    let page_num = Number(data.query['pagenum']);
    return await this.PostService.listDiaries(page_num, user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addPersonalDiary(@CurrentUser() user, @Body() data: object) {
    if (!user) {
      return new UnauthorizedException('유저 정보를 확인해 주세요.');
    }

    return await this.PostService.addPersonalDiary(data, user.id);
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

    return await this.PostService.deletePersonalDiary(postId, user.id);
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
    return await this.PostService.modifyPersonalDiary(postid, user.id, data);
  }
}
