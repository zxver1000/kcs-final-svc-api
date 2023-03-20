import { UserReadOnly } from '../../user/data/user.schema';

export interface UserMicroserviceDataWrapper {
  success: boolean;
  code: number;
  result?: UserReadOnly[] | boolean;
}
