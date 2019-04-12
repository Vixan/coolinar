import { IsString, MaxLength, IsEmail, IsNotEmpty } from 'class-validator';
import { Expose, Exclude } from 'class-transformer';

/**
 * User registration credentials received from the client and validated.
 *
 * @export
 * @class RegisterUserDto
 */
@Exclude()
export class RegisterUserDto {
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
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  readonly password: string;
}
