import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorator/user.decorator';
import { PostGroupCreateDto } from './data/dto/post-group.create.dto';

import { PostGroupUpdateDto } from './data/dto/post-group.update.dto';
import { PostGroupService } from './post-group.service';

@Controller('group')
export class PostGroupController {
  constructor(private readonly postGroupService: PostGroupService) {}

  private logger = new Logger('PostGroupController');
  @Get()
  @UseGuards(JwtAuthGuard)
  async getPostGroups(@CurrentUser() user, @Query('pagenum') pagenum: number) {
    if (!user) {
      return new UnauthorizedException('유저 정보를 확인해 주세요.');
    }
    this.logger.debug('getPostGroupList.pagenum', pagenum);

    return await this.postGroupService.getTripList(pagenum, user.id);
  }

  @Get('title/:postGroupName')
  @UseGuards(JwtAuthGuard)
  async findPostGroup(
    @Param('postGroupName') postGroupName: string,
    @CurrentUser() user,
  ) {
    if (!user) {
      return new UnauthorizedException('유저 정보를 확인해 주세요.');
    }
    this.logger.debug('findPostGroup.postGroupName', postGroupName);

    return await this.postGroupService.findPostGroup(postGroupName, user.id);
  }
  @Get(':postGroupId')
  @UseGuards(JwtAuthGuard)
  async getPostGroup(
    @Param('postGroupId') postGroupId: string,
    @CurrentUser() user,
  ) {
    if (!user) {
      return new UnauthorizedException('유저 정보를 확인해 주세요.');
    }
    this.logger.debug('getPostGroup.id ', postGroupId);

    return await this.postGroupService.getTrip(postGroupId, user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addPostGroup(@CurrentUser() user, @Body() data: PostGroupCreateDto) {
    this.logger.debug('addPostGroup.user:', user);
    if (!user) {
      return new UnauthorizedException('유저 정보를 확인해 주세요.');
    }

    this.logger.debug('addPostGroup.data', data);

    return await this.postGroupService.addTrip(data, user.id);
  }

  @Delete('posts')
  @UseGuards(JwtAuthGuard)
  async deletePostGroupInPost(
    @CurrentUser() user,
    @Body('id') postGroupId: string,
    @Body('posts') posts: string[],
  ) {
    if (!user) {
      return new UnauthorizedException('유저 정보를 확인해 주세요.');
    }
    this.logger.debug('deletePostGroup.postGroupId', postGroupId);

    return await this.postGroupService.deletePostGroupInPost(
      postGroupId,
      user.id,
      posts,
    );
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deletePostGroup(
    @CurrentUser() user,
    @Body('id') postGroupId: string[],
  ) {
    if (!user) {
      return new UnauthorizedException('유저 정보를 확인해 주세요.');
    }

    this.logger.debug('deletePostGroup.postGroupId', postGroupId);
    return await this.postGroupService.deletePostGroup(postGroupId, user.id);
  }
  @Patch()
  @UseGuards(JwtAuthGuard)
  async modifyPostGroup(@CurrentUser() user, @Body() data: PostGroupUpdateDto) {
    if (!user) {
      return new UnauthorizedException('유저 정보를 확인해 주세요.');
    }

    this.logger.debug('modifyPostGroup.data', data);
    return await this.postGroupService.modifyTrip(data, user.id);
  }
}
