import { UserMicroServiceDTO } from '../dto/UserDto';

export interface MicroserviceDataWrapper {
  success: boolean;
  code: number;
  result?: UserMicroServiceDTO[];
}
