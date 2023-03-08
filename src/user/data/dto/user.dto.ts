import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../user.schema';

export class UserMicroserviceDto extends PickType(User, [
  'email',
  'nickname',
  'profileimage',
] as const) {
  @ApiProperty({
    example: 'ObjectID',
    description: 'Mongo ObjectID',
  })
  id: string;
}
