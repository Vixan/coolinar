import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

/**
 * User login credentials received from the client and validated.
 *
 * @export
 * @class LoginUserDto
 */
@Exclude()
export class LoginUserDto {
  @Expose()
  @IsEmail({}, { message: 'Incorrect email format' })
  @IsNotEmpty({ message: 'Email is required' })
  readonly email: string;

  @Expose()
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  readonly password: string;
}
