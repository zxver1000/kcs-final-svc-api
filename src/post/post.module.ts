import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from '../auth/auth.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

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
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
