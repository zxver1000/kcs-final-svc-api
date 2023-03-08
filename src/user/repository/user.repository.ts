import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MicroserviceDataWrapper } from '../common/ microservice-data-wrapper';
import {
  UserSchema,
  UserReadOnlySchema,
  userDocument,
} from '../dto/User.Schema';
import { UserCreateDTo } from '../dto/UserCreateDTO';
import { UserMicroServiceDTO } from '../dto/UserDto';

@Injectable()
export class UserRepository {
  private logger = new Logger('User-Repository');
  constructor(
    @InjectModel(UserSchema.name) private userModel: Model<userDocument>,
  ) {}

  async createuser(UserCreateDTO: UserCreateDTo) {
    const users = new this.userModel(UserCreateDTO);

    console.log(users);
    await users.save();

    return '생성완료';
  }
  async getuser_fromEmail(email: string) {
    const user = await this.userModel.findOne({ email: email });

    console.log('머야왜안대');
    console.log(user);
    return user.readOnlyData;
  }

  async getUserFromDB(userid: string): Promise<MicroserviceDataWrapper> {
    let user;
    try {
      const user: UserMicroServiceDTO = (await this.userModel.findOne({
        _id: '6405a394abdb68d092602dba',
      })) as UserMicroServiceDTO;

      if (!!user) {
        //user = user as UserMicroServiceDTO;
        return {
          success: true,
          code: HttpStatus.OK,
          result: [user],
        };
      }
    } catch (e) {
      this.logger.error(e.stack || e);

      return {
        success: false,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
    return {
      success: false,
      code: HttpStatus.NO_CONTENT,
    };
  }
}
