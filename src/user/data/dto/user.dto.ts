import { ApiProperty, PickType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from '../user.schema';

export class UserMicroserviceDto extends PickType(User, [
  'id',
  'email',
  'nickname',
  'profileimage',
] as const) {
  //* 예민한 정보 제외
  @Exclude()
  password: string;

  //* 예민한 정보 제외
  constructor(partial: Partial<UserMicroserviceDto>) {
    super();
    if (!!partial && partial.password) {
      delete partial.password;
    }
    Object.assign(this, partial);
  }
}
