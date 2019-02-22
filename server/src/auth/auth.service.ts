import { Injectable } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from 'src/users/users.entity';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  createToken(user: User) {
    const jwtPayload: JwtPayload = { email: user.email };
    const expiresIn = this.configService.jwtExpiration;
    const accessToken = this.jwtService.sign(jwtPayload, { expiresIn });

    return {
      expiresIn,
      accessToken,
    };
  }

  async validatePayload(payload: JwtPayload): Promise<any> {
    return await this.usersService.findByEmail(payload.email);
  }
}
