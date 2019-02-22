import * as jwt from 'jsonwebtoken';
import { ConfigService } from '../config/config.service';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from 'src/users/users.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  createToken(user: User) {
    const expiresIn = this.configService.jwtExpiration;
    const accessToken = jwt.sign(
      {
        email: user.email,
      },
      this.configService.jwtSecret,
      { expiresIn },
    );

    return {
      expiresIn,
      accessToken,
    };
  }

  async validatePayload(payload: JwtPayload): Promise<any> {
    return await this.usersService.findByEmail(payload.email);
  }
}
