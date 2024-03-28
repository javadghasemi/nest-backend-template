import { UserDto } from './user.dto';

export class CreateUserRequestDto extends UserDto {
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
}
