import { PickType } from '@nestjs/swagger';
import { User } from '../user.schema';

export class UserCreateDto extends PickType(User, [
  'email',
  'nickname',
  'password',
  'profileimage',
] as const) {}

export interface UserPasswordDto {
  currentPassword: string;
  newPassword: string;
}
