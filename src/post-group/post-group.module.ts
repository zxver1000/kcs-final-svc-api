import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from '../auth/auth.module';
import { PostGroupController } from './post-group.controller';
import { PostGroupService } from './post-group.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'MS-Post',
        transport: Transport.TCP,
        options: {
          host: process.env.PostHost,
          port: Number(process.env.PostPort),
        },
      },
    ]),
  ],
  controllers: [PostGroupController],
  providers: [PostGroupService],
})
export class PostGroupModule {}
