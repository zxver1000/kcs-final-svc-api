import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import { FileServerService } from './file-server.service';
import { CurrentUser } from '../common/decorator/user.decorator';
import { User } from '../user/data/user.schema';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FileServerController {
  constructor(private readonly fileService: FileServerService) {}

  @Get(':id')
  async getFileInfo(@Param('id') fileid: string) {
    return await this.fileService.getFileInfo(fileid);
  }

  @ApiOperation({ summary: '글 파일 업로드 - 이미지' })
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() user: User,
  ) {
    console.log('files: ', files);
    return await this.fileService.uploadFile(files, user);
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
