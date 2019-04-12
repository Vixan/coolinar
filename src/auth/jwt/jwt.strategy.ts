import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { JwtPayload } from './jwt-payload.interface';
import { ConfigService } from '../../config/config.service';
import { User } from '../../users/users.entity';

/**
 * JWT implementation of the passport strategy.
 *
 * @class JwtStrategy
 * @extends {PassportStrategy(Strategy, 'jwt')}
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.jwtSecret,
    });
  }

  /**
   * Validate user credentials sent as the JWT payload.
   *
   * @param {JwtPayload} payload User credentials specified in the JWT payload.
   * @returns {Promise<Promise>} The authenticated user.
   * @memberof JwtStrategy
   */
  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.authService.validateUser(payload);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
