import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
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

  @Get('/:data')
  @UseGuards(JwtAuthGuard)
  async getPost(@CurrentUser() user, @Param('data') data: string) {
    if (!user) {
      return new UnauthorizedException('유저 정보를 확인해 주세요.');
    }

    if (data.length > 20) {
      //아이디준거
      return this.PostService.getPersonalDiary(data, user.id);
    } else {
      //pagenumber!
      let page_num = Number(data);
      let k = await this.PostService.listDiaries(page_num, user.id);
      console.log(k);

      return await this.PostService.listDiaries(page_num, user.id);
    }
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
