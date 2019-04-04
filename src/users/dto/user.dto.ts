import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsEmail,
  MaxLength,
  IsNotEmpty,
  IsOptional,
  IsUrl,
} from 'class-validator';

@Exclude()
export class UserDto {
  @Expose()
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @MaxLength(255, { message: 'Username must be maximum 255 characters' })
  readonly name: string;

  @Expose()
  @IsEmail({}, { message: 'Incorrect email format' })
  @IsNotEmpty({ message: 'Email is required' })
  readonly email: string;

  @Expose()
  @IsOptional()
  @IsUrl({}, { message: 'User avatar must be a valid URL' })
  readonly avatarUrl: string;

  @Expose()
  @IsOptional()
  readonly favoriteRecipes: string[];
}
