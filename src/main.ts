import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

class Application {
  static instnace: Application;
  private logger = new Logger('TripDiary - Post');
  private DEV_MODE: boolean;
  private PORT: string;
  private corsOriginList: string[];
  private ADMIN_USER: string;
  private ADMIN_PASSWORD: string;
  private USE_AUTH: string;
  constructor(private server: NestExpressApplication) {
    if (Application.instnace) return Application.instnace;
    this.server = server;

    if (
      process.env.ADMIN_PAGE_PREFIX &&
      (process.env.ADMIN_PAGE_PREFIX === '' ||
        process.env.ADMIN_PAGE_PREFIX === '/')
    ) {
      this.logger.error('Set "ADMIN_PAGE_PREFIX" not to be empty and [/]');
      throw new Error('🆘 Set "ADMIN_PAGE_PREFIX" not to be empty and [/]');
    }

    this.DEV_MODE = process.env.NODE_ENV === 'production' ? false : true;
    this.PORT = process.env.PORT || '3088';
    this.corsOriginList = process.env.CORS_ORIGIN_LIST
      ? process.env.CORS_ORIGIN_LIST.split(',').map((origin) => origin.trim())
      : ['*'];

    Application.instnace = this;
  }
  private async setUpGlobalMiddleware() {
    this.server.enableCors({
      origin: this.corsOriginList,
      credentials: true,
    });
    this.logger.log('Setting ValidationPipe...');
    this.server.useGlobalPipes(new ValidationPipe({ transform: true }));

    this.logger.log('Setting Logger Middleware...');

    this.logger.log('Setting Global Interceptors...');
  }
  async boostrap() {
    this.logger.log('Setting Global Middleware...');
    await this.setUpGlobalMiddleware();
    this.logger.log('✅ SetUpGlobalMiddleware Ok');
    await this.server.listen(this.PORT);
  }
  startLog() {
    if (this.DEV_MODE) {
      this.logger.log(`✅ Server on http://localhost:${this.PORT}`);
    } else {
      this.logger.log(`✅ Server on port ${this.PORT}...`);
    }
  }

  errorLog(error: string) {
    this.logger.error(`🆘 Server error ${error}`);
  }
}

async function init(): Promise<void> {
  const server = await NestFactory.create<NestExpressApplication>(AppModule);
  const app = new Application(server);
  await app.boostrap();
  app.startLog();
}

init().catch((error) => {
  new Logger('init').error(error);
});
