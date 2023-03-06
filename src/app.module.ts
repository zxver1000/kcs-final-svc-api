import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/interceptor/logger/logger.middleware';
import { FileServerModule } from './file-server/file-server.module';
import { HealthCheckModule } from './health-check/health-check.module';

@Module({
  imports: [ConfigModule.forRoot(), FileServerModule, HealthCheckModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  private readonly isDev: boolean = process.env.MODE === 'dev' ? true : false;
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
