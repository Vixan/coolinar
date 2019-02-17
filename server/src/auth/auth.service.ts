import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from './dto/register.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/users.entity';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async register(user: RegisterDto): Promise<any> {
    return await this.userRepository.save(user);
  }

  createToken(user: User) {
    const expiresIn: number = 86400 * 30;
    const accessToken = jwt.sign(
      {
        email: user.email,
      },
      'AdminSecret',
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
