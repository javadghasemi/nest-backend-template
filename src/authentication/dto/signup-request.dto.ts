import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

export class SignupRequestDto {
  @Length(3)
  @IsString()
  firstName: string;

  @Length(3)
  @IsString()
  public lastName: string;

  @IsEmail()
  @IsString()
  public email: string;

  @IsStrongPassword()
  @Length(6)
  @IsString()
  public password: string;
}
