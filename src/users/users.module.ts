import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { IsUserEmailAvailable } from 'src/auth/validation/user-email-available.constraint';
import { IsUserEmailUnavailable } from 'src/auth/validation/user-email-unavailable.constraint';
import { IsUserNameAvailable } from 'src/auth/validation/user-name-available.constraint';

/**
 * Module to encapsulate user logic.
 *
 * @export UsersService Service that exposes user handling logic.
 * @class UsersModule
 */
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    IsUserEmailAvailable,
    IsUserEmailUnavailable,
    IsUserNameAvailable,
  ],
  exports: [UsersService],
})
export class UsersModule {}
