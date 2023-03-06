import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FilesMicroServiceDto } from '../data/dto/file-ms.dto';
import { FileServerService } from '../service/file-server.service';

@Controller('files')
export class FileServerController {
  private readonly redisPrefixKey = 'file';
  constructor(private readonly fileService: FileServerService) {}

  @MessagePattern({ cmd: 'read_file' })
  getFileInfo(@Payload() data: FilesMicroServiceDto) {
    return this.fileService.getFileInfo(`${data.fileid}`);
  }

  @MessagePattern({ cmd: 'create_file' })
  uploadFile(@Payload() data: FilesMicroServiceDto) {
    return this.fileService.uploadFile(data);
  }
}
