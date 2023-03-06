import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthCheckModule } from './health-check/health-check.module';
import { AuthModule } from './auth/auth.module';
import { FileServerModule } from './file-server/file-server.module';
import { LoggerMiddleware } from './common/interceptor/logger/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HealthCheckModule,
    AuthModule,
    FileServerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  private readonly isDev: boolean = process.env.MODE === 'dev' ? true : false;
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
