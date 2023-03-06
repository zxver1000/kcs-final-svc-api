import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FilesMicroServiceDto } from '../data/dto/file-ms.dto';
import { FileServerService } from '../service/file-server.service';

@Controller('files')
export class FileServerController {
  constructor(private readonly fileService: FileServerService) {}

  @Get(':id')
  async getFileInfo(@Param('id') fileid: string) {
    const result = await this.fileService.getFileInfo(fileid);
    return result;
  }

  @Post()
  uploadFileHttp(@Body() data: FilesMicroServiceDto) {
    console.log('Upload requested', data);
    return this.fileService.uploadFile(data);
  }
}
