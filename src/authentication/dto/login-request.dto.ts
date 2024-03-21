import { IsString, Length } from 'class-validator';

export class LoginRequestDto {
  @Length(3)
  @IsString()
  public username: string;

  @Length(3)
  @IsString()
  public password: string;
}
