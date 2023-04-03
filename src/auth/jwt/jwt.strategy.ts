import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserReadOnly } from 'src/user/data/user.schema';
import { UserService } from '../../user/user.service';
import { Payload } from './jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger('JwtStrategy');
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload): Promise<UserReadOnly> {
    this.logger.debug('payload', payload);
    const msDataFromUserServer = await this.userService.getUser({
      id: payload.sub,
    });

    this.logger.log('userService.getUserById:', msDataFromUserServer);
    if (!msDataFromUserServer) {
      throw new UnauthorizedException('유저 정보를 확인해 주세요.');
    }

    if (!msDataFromUserServer.success || msDataFromUserServer.code >= 400) {
      throw new UnauthorizedException('유저 정보를 확인해 주세요.');
    }

    try {
      const user = msDataFromUserServer.result[0];
      return user;
    } catch (e) {
      throw new UnauthorizedException('유저 정보를 확인해 주세요.');
    }
  }
}
