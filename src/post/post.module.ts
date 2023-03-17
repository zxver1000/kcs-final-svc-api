import { forwardRef, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from 'src/auth/auth.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
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
    forwardRef(() => AuthModule),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
