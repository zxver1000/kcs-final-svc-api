import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FileServerController } from './controller/file-server.controller';
import { FileServerService } from './service/file-server.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'MS-FileServer',
        transport: Transport.TCP,
        options: {
          host: process.env.FileServerHost,
          port: Number(process.env.FileServerPort),
        },
      },
    ]),
  ],
  controllers: [FileServerController],
  providers: [FileServerService],
})
export class FileServerModule {}
