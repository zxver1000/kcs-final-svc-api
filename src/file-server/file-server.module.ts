import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisManagerModule } from 'src/redis-manager/redis-manager.module';
import { FileServerController } from './controller/file-server.controller';
import { FileServerService } from './service/file-server.service';

@Module({
  imports: [ConfigModule.forRoot(), RedisManagerModule],
  controllers: [FileServerController],
  providers: [FileServerService],
  exports: [FileServerService],
})
export class FileServerModule {}
