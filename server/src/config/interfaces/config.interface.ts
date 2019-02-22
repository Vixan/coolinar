import {
  IsString,
  IsIn,
  IsPositive,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

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
}
