import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUser() {
    return 'Hello User MS World';
  }
}
