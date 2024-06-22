import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { IsEqualTo } from 'src/modules/common/decorators/is-equal-to.decorator';

export const strongPass = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Matches(strongPass, {
    message: 'Password is too weak',
  })
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEqualTo('password', { message: 'The passwords do not match' })
  passwordConfirmation: string;
}
