import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { SignupRequestDto } from './dto/signup-request.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { User } from '../users/entity/user.entity';
import { WrongLoginInfoException } from './exception/wrong-login-info.exception';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationModuleOptions } from './interfaces/AuthenticationModuleOptions';
import { AUTHENTICATION_MODULE_OPTIONS } from './constants';
import { UserNotFoundException } from './exception/user-not-found.exception';

@Injectable()
export class AuthenticationService {
  constructor(
    private usersService: UsersService,
    private JwtService: JwtService,
    @Inject(AUTHENTICATION_MODULE_OPTIONS)
    private options: AuthenticationModuleOptions,
  ) {}

  public async signup(userInfo: SignupRequestDto) {
    const user: CreateUserDto = new CreateUserDto();

    user.firstName = userInfo.firstName;
    user.lastName = userInfo.lastName;
    user.email = userInfo.email;
    user.username = userInfo.username;
    user.password = userInfo.password;

    return await this.usersService.create(user);
  }

  public async login(loginInfo: LoginRequestDto): Promise<LoginResponseDto> {
    const wrongInformationException: WrongLoginInfoException =
      new WrongLoginInfoException('username');

    let user: User | null;
    try {
      user = await this.usersService.getByUsername(loginInfo.username);
    } catch (e) {
      if (e instanceof UserNotFoundException) {
        throw wrongInformationException;
      }
    }

    if (!(await this.validatePassword(loginInfo.password, user.password))) {
      throw wrongInformationException;
    }

    const payload: { sub: number; username: string } = {
      sub: user.id,
      username: user.username,
    };

    const accessToken: string = await this.JwtService.signAsync(payload);

    return new LoginResponseDto(accessToken);
  }

  private async validatePassword(
    actualPassword: string,
    encryptedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(actualPassword, encryptedPassword);
  }
}
