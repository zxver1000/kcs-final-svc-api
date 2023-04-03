import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthCheckModule } from './health-check/health-check.module';
import { PostModule } from './post/post.module';
import { PostGroupModule } from './post-group/post-group.module';
import mongoose from 'mongoose';

@Module({
  imports: [
    PostModule,
    ConfigModule.forRoot(),
    HealthCheckModule,
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    PostGroupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    mongoose.set('debug', true);
  }
}
