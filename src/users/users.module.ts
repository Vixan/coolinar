import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { SlugProvider } from 'src/shared/providers/slug.provider';

/**
 * Module to encapsulate user logic.
 *
 * @export UsersService Service that exposes user handling logic.
 * @class UsersModule
 */
@Module({
  imports: [TypeOrmModule.forFeature([User]), EncryptionModule],
  controllers: [UsersController],
  providers: [UsersService, SlugProvider],
  exports: [UsersService],
})
export class UsersModule {}
