import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import { FileServerService } from './file-server.service';
import { CurrentUser } from '../common/decorator/user.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { UserReadOnly } from 'src/user/data/user.schema';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FileServerController {
  private logger = new Logger('FileServerController');
  constructor(private readonly fileService: FileServerService) {}

  @Get(':id')
  async getFileInfo(@Param('id') fileid: string) {
    return await this.fileService.getFileInfo(fileid);
  }

  @ApiOperation({ summary: '글 파일 업로드 - 이미지' })
  @Post('post')
  async uploadFile(@Body() files, @CurrentUser() user: UserReadOnly) {
    return await this.fileService.uploadFile(files.files, user);
  }

  @ApiOperation({ summary: '유저 프로필 업로드 ' })
  @Post('profile')
  async uploadProfile(@Body() file, @CurrentUser() user: UserReadOnly) {
    const _file: Express.Multer.File = file.file;
    return await this.fileService.uploadProfileFile([_file], user);
  }

  @ApiOperation({ summary: '저장된 파일 삭제 기능 ' })
  @Delete('post/:id')
  async deleteFile(
    @Param('id') fileid: string,
    @CurrentUser() user: UserReadOnly,
  ) {
    return await this.fileService.deleteFile(fileid, user.id);
  }
  /* files
[
  {
    fieldname: 'image',
    originalname: '스크린샷 2023-02-23 오후 4.47.09.png',
    encoding: '7bit',
    mimetype: 'image/png',
    destination: '/Users/eugene/Playground/NodeJS/nestjs/kcs/api-gateway/dist/common/uploads/board',
    filename: '스크린샷 2023-02-23 오후 4.47.091678079902441.png',
    path: '/Users/eugene/Playground/NodeJS/nestjs/kcs/api-gateway/dist/common/uploads/board/스크린샷 2023-02-23 오후 4.47.091678079902441.png',
    size: 860647
  }
]
    */
}
