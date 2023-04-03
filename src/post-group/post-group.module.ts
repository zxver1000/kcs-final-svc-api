import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '../post/data/post.schema';
import { RedisManagerModule } from '../redis-manager/redis-manager.module';
import { PostGroupRepository } from './data/post-group.repository';
import { PostGroup, PostGroupSchema } from './data/post-group.schema';
import { PostGroupService } from './post-group.service';
import { PostGroupController } from './post-group.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PostGroup.name, schema: PostGroupSchema },
    ]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    RedisManagerModule,
  ],
  providers: [PostGroupService, PostGroupRepository],
  exports: [PostGroupService],
  controllers: [PostGroupController],
})
export class PostGroupModule {}
