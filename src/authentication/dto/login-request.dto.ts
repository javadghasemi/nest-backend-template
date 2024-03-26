import { IsEmail, IsString, Length } from 'class-validator';

export class LoginRequestDto {
  @IsEmail()
  @IsString()
  public email: string;

  @Length(3)
  @IsString()
  public password: string;
}
