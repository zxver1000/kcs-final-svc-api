import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';

@Injectable()
export class UserService {
  private gatewayTimeout: number;
  constructor(
    @Inject('MS-User')
    private readonly userClient: ClientProxy,
  ) {
    //* ms
    this.gatewayTimeout = Number(process.env.GatewayTimeout) || 5000;
    if (isNaN(this.gatewayTimeout)) this.gatewayTimeout = 5000;
  }

  getUser() {
    return this.userClient
      .send(
        {
          cmd: 'get_user',
        },
        {},
      )
      .pipe(timeout(this.gatewayTimeout));
  }
}
