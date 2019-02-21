import {
  Controller,
  Post,
  Body,
  UsePipes,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/user-login.dto';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/user-register.dto';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { ConflictException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: LoginUserDto): Promise<any> {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user) {
      throw new ForbiddenException({
        errors: { email: 'Inexistent email' },
      });
    }

    const userToken = this.authService.createToken(user);

    return userToken;
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() registerDto: RegisterUserDto): Promise<any> {
    const user = await this.userService.findByEmail(registerDto.email);

    if (user) {
      throw new ConflictException({
        errors: { email: 'Email already in use' },
      });
    }

    this.userService.add(registerDto);
  }
}
