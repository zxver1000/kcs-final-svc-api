import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';
import { FilesMicroServiceDto } from '../data/dto/file-ms.dto';

@Injectable()
export class FileServerService {
  private gatewayTimeout: number;
  constructor(
    @Inject('MS-FileServer')
    private readonly fileClient: ClientProxy,
  ) {
    //* ms
    this.gatewayTimeout = Number(process.env.GatewayTimeout) || 5000;
    if (isNaN(this.gatewayTimeout)) this.gatewayTimeout = 5000;
  }

  async getFileInfo(fileid: string) {
    return this.fileClient
      .send(
        {
          cmd: 'read_file',
        },
        {
          fileid,
        },
      )
      .pipe(timeout(this.gatewayTimeout));
  }

  async uploadFile(fileInfo: FilesMicroServiceDto) {
    return this.fileClient
      .send(
        {
          cmd: 'create_file',
        },
        fileInfo,
      )
      .pipe(timeout(this.gatewayTimeout));
  }
}
