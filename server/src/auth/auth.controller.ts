import {
  Controller,
  Post,
  Body,
  UsePipes,
  ForbiddenException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/user-login.dto';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/user-register.dto';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { ConflictException } from '@nestjs/common';
import { EncryptionService } from '../encryption/encryption.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly encryptionService: EncryptionService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.userService.findByEmail(loginUserDto.email);

    if (!user) {
      throw new ForbiddenException({
        errors: { email: 'Inexistent email' },
      });
    }

    const isPasswordCorrect = await this.encryptionService.matchesHash(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new ForbiddenException({
        errors: { password: 'Incorrect password' },
      });
    }

    return this.authService.createToken(user);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  async register(@Body() registerUserDto: RegisterUserDto): Promise<any> {
    const user = await this.userService.findByEmail(registerUserDto.email);

    if (user) {
      throw new ConflictException({
        errors: { email: 'Email already in use' },
      });
    }

    const createdUser = await this.userService.add(registerUserDto);

    return this.authService.createToken(createdUser);
  }
}
