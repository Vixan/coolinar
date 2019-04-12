import {
  IsString,
  IsIn,
  IsPositive,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Model for configuration settings of the application.
 * @prop {string} NODE_ENV Node environment.
 * @prop {number} PORT The port the application is running on.
 * @prop {string} DB_NAME Database to connect to.
 * @prop {string} DB_USER Database username.
 * @prop {string} DB_PASSWORD Database user password.
 * @prop {string} JWT_SECRET Secret or private key used for JWT generation.
 * @prop {number} JWT_EXPIRATION Expiration time of the JWT.
 * @prop {number} HASH_SALT_ROUNDS Hashing rounds used by the hashing algorithm.
 *
 * @class Config
 */
export class Config {
  @IsString({ message: 'NODE_ENV must be a specific string' })
  @IsIn(['development', 'production', 'test'], {
    message: 'NODE_ENV must be either development, production or test',
  })
  NODE_ENV: string = 'development';

  @IsPositive({ message: 'PORT number must be an unsigned integer' })
  @IsNumber({}, { message: 'PORT must be a number' })
  @Transform(value => parseInt(value, 10), { toClassOnly: true })
  PORT: number = 3000;

  @IsOptional()
  @IsString({ message: 'Database name must be a string' })
  DB_NAME: string = 'coolinar';

  @IsOptional()
  @IsString({ message: 'Database username must be a string' })
  DB_USER: string = 'admin';

  @IsOptional()
  @IsString({ message: 'Database password must be a string' })
  DB_PASSWORD: string = 'admin';

  @IsString({ message: 'JWT Secret must be a string' })
  JWT_SECRET: string = 'AdminSecret';

  @IsOptional()
  @Transform(value => parseInt(value, 10), { toClassOnly: true })
  JWT_EXPIRATION: number = 1800;

  @IsOptional()
  @Transform(value => parseInt(value, 10), { toClassOnly: true })
  HASH_SALT_ROUNDS: number = 10;
}
