import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserSchema } from './User.Schema';

export class UserMicroServiceDTO extends PickType(UserSchema, [
  'email',
  'nickname',
  'profileimage',
] as const) {
  @ApiProperty({
    example: 'ObjectID',
    description: 'Mongo ObjectID'
  })
  id: string;
}
