import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './strategies/local/local-auth.guard';
import { SignInUserDto, ApiTokenDto, SignUpUserDto } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Body() user: SignInUserDto): Promise<ApiTokenDto> {
    return this.authService.signIn(user);
  }

  @Post('sign-up')
  async signUp(@Body() user: SignUpUserDto): Promise<ApiTokenDto> {
    return this.authService.signUp(user);
  }
}
