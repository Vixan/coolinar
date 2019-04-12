import { Injectable } from '@nestjs/common';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { User } from 'src/users/users.entity';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import { JwtResponseDto } from './jwt/jwt-response.dto';

/**
 * Injectable service for authentication logic.
 *
 * @class AuthService
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Creates the JWT response for the specified user.
   *
   * @param {User} user User to be authenticated.
   * @returns {JwtResponseDto} Generated JWT response.
   * @memberof AuthService
   */
  createToken(user: User): JwtResponseDto {
    const jwtPayload: JwtPayload = { email: user.email };
    const expiresIn = this.configService.jwtExpiration;
    const accessToken = this.jwtService.sign(jwtPayload, { expiresIn });
    const jwtResponseDto: JwtResponseDto = {
      expiresIn,
      accessToken,
    };

    return jwtResponseDto;
  }

  /**
   *
   *
   * @param {JwtPayload} payload User credentials specified in the JWT payload.
   * @returns {(Promise<User | null>)} A promise of the validated User or null
   * if validation of the credentials failed.
   * @memberof AuthService
   */
  async validateUser(payload: JwtPayload): Promise<User | null> {
    return await this.usersService.findByEmail(payload.email);
  }
}
