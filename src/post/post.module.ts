import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './data/post.schema';
import { Module } from '@nestjs/common';
import { PostRepository } from './data/post.repository';
import { RedisManagerModule } from '../redis-manager/redis-manager.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    RedisManagerModule,
  ],
  providers: [PostService, PostRepository],
  controllers: [PostController],
})
export class PostModule {}
