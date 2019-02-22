import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UsersModule, AuthModule, ConfigModule],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
