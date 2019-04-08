import {
  Controller,
  Get,
  UseGuards,
  Param,
  UseInterceptors,
  Delete,
  NotFoundException,
  Put,
  Body,
  UsePipes,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { ArrayUtils } from 'src/shared/utils/array.utils';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(new TransformInterceptor(UserDto))
  async getAll(): Promise<UserDto[]> {
    return this.usersService.findAll();
  }

  @Get('/search')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(new TransformInterceptor(UserDto))
  async searchByName(@Query() params: any): Promise<UserDto | null> {
    if (params.name) {
      return await this.usersService.findByName(params.name);
    }

    return null;
  }

  @Post()
  @UseInterceptors(new TransformInterceptor(UserDto))
  async getByEmail(@Body('email') email: string): Promise<User> {
    return this.usersService.findByEmail(email);
  }

  @Get(':slug')
  @UseInterceptors(new TransformInterceptor(UserDto))
  async getBySlug(@Param('slug') slug: string): Promise<User> {
    return this.usersService.findBySlug(slug);
  }

  @Put(':slug')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  @UseInterceptors(new TransformInterceptor(UserDto))
  async update(
    @Param('slug') slug: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    const user = await this.usersService.findBySlug(slug);

    if (!user) {
      throw new NotFoundException({ errors: { slug: 'User not found' } });
    }

    return this.usersService.update({ ...user, ...updateUserDto });
  }

  @Delete(':slug')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(new TransformInterceptor(UserDto))
  async delete(@Param('slug') slug: string): Promise<User> {
    const user = await this.usersService.findBySlug(slug);

    if (!user) {
      throw new NotFoundException({ errors: { slug: 'User not found' } });
    }

    return this.usersService.delete(user);
  }
}
