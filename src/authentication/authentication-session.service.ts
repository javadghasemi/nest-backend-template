import { AuthenticationServiceInterface } from './interfaces/authentication-service.interface';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { SignupRequestDto } from './dto/signup-request.dto';
import { CreateUserResponseDto } from '../users/dto/create-user-response.dto';
import { LoggedInUserInterface } from './interfaces/logged-in-user.interface';
import { UsersService } from '../users/users.service';
import { Inject } from '@nestjs/common';
import { AUTHENTICATION_MODULE_OPTIONS } from './constants';
import { AuthenticationModuleOptionsInterface } from './interfaces/authentication-module-options.interface';
import { WrongLoginInfoException } from './exception/wrong-login-info.exception';
import { User } from '../users/entity/user.entity';
import { UserNotFoundException } from '../users/exception/user-not-found.exception';
import * as bcrypt from 'bcrypt';

export class AuthenticationSessionService
  implements AuthenticationServiceInterface
{
  constructor(
    private usersService: UsersService,
    @Inject(AUTHENTICATION_MODULE_OPTIONS)
    private options: AuthenticationModuleOptionsInterface,
  ) {}
  public async login(userInfo: LoginRequestDto): Promise<LoginResponseDto> {
    const wrongInformationException: WrongLoginInfoException =
      new WrongLoginInfoException('email');

    let user: User | null;
    try {
      user = await this.usersService.getByEmail(userInfo.email);
    } catch (e) {
      if (e instanceof UserNotFoundException) {
        throw wrongInformationException;
      }
    }

    if (!(await this.validatePassword(userInfo.password, user.password))) {
      throw wrongInformationException;
    }

    return new LoginResponseDto('aws');
  }

  signup(userInfo: SignupRequestDto): Promise<CreateUserResponseDto> {
    return Promise.resolve(undefined);
  }

  validateToken(token: string): Promise<LoggedInUserInterface> {
    return Promise.resolve(undefined);
  }

  private async validatePassword(
    actualPassword: string,
    encryptedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(actualPassword, encryptedPassword);
  }
}
