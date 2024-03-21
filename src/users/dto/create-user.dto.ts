import { UserDto } from './user.dto';

export class CreateUserDto extends UserDto {
  public firstName: string;
  public lastName: string;
  public email: string;
  public username: string;
  public password: string;
}
