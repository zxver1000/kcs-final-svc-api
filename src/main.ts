import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

class Application {
  static instance: Application;
  private logger = new Logger('TripDiary - Api Gateway');
  private DEV_MODE: boolean;
  private PORT: string;
  private corsOriginList: string[];
  private ADMIN_USER: string;
  private ADMIN_PASSWORD: string;
  private USE_AUTH: string;

  constructor(private server: NestExpressApplication) {
    if (Application.instance) return Application.instance;
    this.server = server;

    if (
      process.env.ADMIN_PAGE_PREFIX &&
      (process.env.ADMIN_PAGE_PREFIX === '' ||
        process.env.ADMIN_PAGE_PREFIX === '/')
    ) {
      this.logger.error('Set "ADMIN_PAGE_PREFIX" not to be empty and [/]');
      throw new Error('🆘 Set "ADMIN_PAGE_PREFIX" not to be empty and [/]');
    }

    if (!process.env.JWT_SECRET) this.logger.error('Set "JWT_SECRET" env');
    if (!process.env.FileServerHost)
      this.logger.error('Set "MicroService.FileServerHost" env');
    if (!process.env.FileServerPort)
      this.logger.error('Set "MicroService.FileServerHost" env');

    try {
      const fileServerPort = parseInt(process.env.FileServerPort);
      if (isNaN(fileServerPort))
        throw new Error('Set "MicroService.FileServerPort" as number');
    } catch (err) {
      throw new Error('Set "MicroService.FileServerPort" as number');
    }

    this.DEV_MODE = process.env.NODE_ENV === 'production' ? false : true;
    this.PORT = process.env.PORT || '3080';
    this.corsOriginList = process.env.CORS_ORIGIN_LIST
      ? process.env.CORS_ORIGIN_LIST.split(',').map((origin) => origin.trim())
      : ['*'];

    Application.instance = this;
  }

  private async setUpGlobalMiddleware() {
    this.server.enableCors({
      origin: this.corsOriginList,
      credentials: true,
    });

    this.logger.log('Setting Logger Middleware...');

    //* Set Global Guard
    // this.server.useGlobalGuards(new SelectableJwtAuthGuard(new Reflector()));

    this.logger.log('Setting Global Interceptors...');

    // this.server.useGlobalInterceptors(new SuccessInterceptor());
    // this.logger.log('✅ SuccessInterceptor Ok');

    // this.logger.log('Setting Global Filters...');
    // this.server.useGlobalFilters(new HttpExceptionFilter());
    // this.logger.log('✅ HttpExceptionFilter Ok');
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
  // const server = await NestFactory.create<NestExpressApplication>(AppModule);
  const app = new Application(server);
  await app.boostrap();
  app.startLog();
}

init().catch((error) => {
  new Logger('init').error(error);
});
