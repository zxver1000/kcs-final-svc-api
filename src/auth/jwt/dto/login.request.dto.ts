import { User } from '../../../user/data/user.schema';
import { PickType } from '@nestjs/swagger';

export class LoginRequestDto extends PickType(User, [
  'email',
  'password',
] as const) {}
