import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('try')
  @Render('index')
  root() {
    return {
      data: 'hello',
    };
  }

  @Get('ex-margin')
  @Render('examples/margin')
  margin() {
    return {
      data: 'hello',
    };
  }
}
