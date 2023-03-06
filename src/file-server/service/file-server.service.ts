import { Injectable } from '@nestjs/common';
import { RedisManagerService } from 'src/redis-manager/redis-manager.service';
import { FilesMicroServiceDto } from '../data/dto/file-ms.dto';

@Injectable()
export class FileServerService {
  private readonly redisPrefixKey = 'file';
  constructor(private readonly redisService: RedisManagerService) {}

  async getFileInfo(fileid: string) {
    //* First find on Redis
    //* If not exist on REdis, find on DB, and add it to Redis, and return it
    const key = `${this.redisPrefixKey}/${fileid}`;
    const result = await this.redisService.getCache(key);
    if (!!result) {
      return {
        success: true,
        result,
      };
    }

    return {
      success: false,
    };
  }

  async uploadFile(fileInfo: FilesMicroServiceDto) {
    //* Just Add it on DB
    console.log('UploadFile');
    const key = `${this.redisPrefixKey}/${fileInfo.fileid}`;
    const result = await this.redisService.setCache(key, fileInfo);
    if (!!result) {
      return {
        success: true,
        result,
      };
    }
    //* hey
    return {
      success: false,
    };
  }
}
