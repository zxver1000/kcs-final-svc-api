import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserSchema } from './User.Schema';

export class UserMicroServiceDTO extends PickType(UserSchema, [
  'email',
  'nickname',
  'profileimage',
] as const) {
  id: string;
}
