import {
  Controller,
  Post,
  Response,
  Body,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { ValidationPipe } from '../shared/pipes/validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async login(@Response() res: any, @Body() loginDto: LoginDto): Promise<any> {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Email or password is incorrect.' });
    }

    const userToken = this.authService.createToken(user);

    return res.status(HttpStatus.OK).json(userToken);
  }

  // @Post()
  // @UsePipes(new ValidationPipe())
  // async register(
  //   @Response() res: any,
  //   @Body() registerDto: RegisterDto,
  // ): Promise<any> {}
}
