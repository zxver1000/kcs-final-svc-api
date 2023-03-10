import { UserMicroserviceDto } from './../../user/data/dto/user.dto';
export interface UserMicroserviceDataWrapper {
  success: boolean;
  code: number;
  result?: UserMicroserviceDto[] | boolean;
}
