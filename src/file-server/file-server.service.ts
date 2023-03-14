import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { FileInfoMicroserviceDataWrapper } from 'src/common/data/file-info.microservice.dto';
import { User } from '../user/data/user.schema';

@Injectable()
export class FileServerService {
  private logger = new Logger('FileServerService');
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
    this.logger.debug('분명 불렸는데..');
    const result = await lastValueFrom(
      this.fileClient
        .send(
          { cmd: 'create_file' },
          // { user, files },
          { userid: user.id, files },
        )
        .pipe(timeout(this.gatewayTimeout)),
    );

    if (!result) {
      throw new InternalServerErrorException();
    }

    if (!result.success) {
      if (result.code >= 400) {
        throw new HttpException(HttpStatus[result.code], result.code);
      }
    }
    return result;
    // .pipe(timeout(this.gatewayTimeout));
    /*.catch((error) => {
        throw new HttpException(error, error.status);
      });
      */
  }
}
