import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { RedisManagerModule } from './redis-manager/redis-manager.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, HealthCheckModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
