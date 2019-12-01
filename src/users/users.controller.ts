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

/**
 * Controller to handle user routes logic.
 *
 * @class UsersController
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Retrieve all users.
   *
   * @returns {Promise<UserDto[]>} Promise of all users.
   * @memberof UsersController
   */
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(new TransformInterceptor(UserDto))
  async getAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  /**
   * Retrieve user by name.
   *
   * @param {*} params
   * @returns {(Promise<UserDto | null>)} Promise of searched user.
   * @memberof UsersController
   */
  @Get('/search')
  @UseInterceptors(new TransformInterceptor(UserDto))
  async searchByName(@Query() params: any): Promise<User> {
    if (params.name) {
      return await this.usersService.findByName(params.name);
    }

    return null;
  }

  /**
   * Retrieve user by email.
   *
   * @param {string} email
   * @returns {Promise<User>} Promise of searched user.
   * @memberof UsersController
   */
  @Post()
  @UseInterceptors(new TransformInterceptor(UserDto))
  async getByEmail(@Body('email') email: string): Promise<User> {
    return this.usersService.findByEmail(email);
  }

  /**
   * Retrieve user by slug.
   *
   * @param {string} slug
   * @returns {Promise<User>} Promise of searched user.
   * @memberof UsersController
   */
  @Get(':slug')
  @UseInterceptors(new TransformInterceptor(UserDto))
  async getBySlug(@Param('slug') slug: string): Promise<User> {
    return this.usersService.findBySlug(slug);
  }

  /**
   * Update user data.
   *
   * @param {string} slug
   * @param {UpdateUserDto} updateUserDto Updated user data sent by client.
   * @returns {Promise<UserDto>} Promise of updated user.
   * @memberof UsersController
   */
  @Put(':slug')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  @UseInterceptors(new TransformInterceptor(UserDto))
  async update(
    @Param('slug') slug: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.usersService.findBySlug(slug);

    if (!user) {
      throw new NotFoundException({ errors: { slug: 'User not found' } });
    }

    return this.usersService.update({ ...user, ...updateUserDto });
  }

  /**
   * Remove user.
   *
   * @param {string} slug
   * @returns {Promise<User>} Promise of removed user.
   * @memberof UsersController
   */
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
