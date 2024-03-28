import { UserDto } from './user.dto';
import { IsString, IsStrongPassword } from 'class-validator';

export class UpdateUserRequestDto extends UserDto {
  @IsStrongPassword()
  @IsString()
  password: string;
}
