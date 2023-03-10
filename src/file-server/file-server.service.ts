import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { FileInfoMicroserviceDataWrapper } from 'src/common/data/file-info.microservice.dto';
import { User } from '../user/data/user.schema';

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

  async getFileInfo(fileid: string): Promise<FileInfoMicroserviceDataWrapper> {
    return await lastValueFrom(
      this.fileClient
        .send(
          {
            cmd: 'read_file',
          },
          {
            fileid,
          },
        )
        .pipe(timeout(this.gatewayTimeout)),
    );
  }

  async uploadFile(
    files: Express.Multer.File[],
    user: User,
  ): Promise<FileInfoMicroserviceDataWrapper> {
    return await lastValueFrom(
      this.fileClient.send(
        { cmd: 'create_file' },
        // { user, files },
        { userid: 'test-userid', files },
      ),
    );
    // .pipe(timeout(this.gatewayTimeout));
    /*.catch((error) => {
        throw new HttpException(error, error.status);
      });
      */
  }
}
