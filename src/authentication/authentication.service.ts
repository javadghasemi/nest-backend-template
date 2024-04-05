import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { SignupRequestDto } from './dto/signup-request.dto';
import { UsersService } from '../users/users.service';
import { CreateUserRequestDto } from '../users/dto/create-user-request.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { User } from '../users/entity/user.entity';
import { WrongLoginInfoException } from './exception/wrong-login-info.exception';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationModuleOptionsInterface } from './interfaces/authentication-module-options.interface';
import { AUTHENTICATION_MODULE_OPTIONS } from './constants';
import { UserNotFoundException } from '../users/exception/user-not-found.exception';
import { LoggedInUserInterface } from './interfaces/logged-in-user.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    private usersService: UsersService,
    private JwtService: JwtService,
    @Inject(AUTHENTICATION_MODULE_OPTIONS)
    private options: AuthenticationModuleOptionsInterface,
  ) {}

  public async signup(userInfo: SignupRequestDto) {
    const user: CreateUserRequestDto = new CreateUserRequestDto();

    user.firstName = userInfo.firstName;
    user.lastName = userInfo.lastName;
    user.email = userInfo.email;
    user.password = userInfo.password;

    return await this.usersService.create(user);
  }

  public async login(loginInfo: LoginRequestDto): Promise<LoginResponseDto> {
    const wrongInformationException: WrongLoginInfoException =
      new WrongLoginInfoException('email');

    let user: User | null;
    try {
      user = await this.usersService.getByEmail(loginInfo.email);
    } catch (e) {
      if (e instanceof UserNotFoundException) {
        throw wrongInformationException;
      }
    }

    if (!(await this.validatePassword(loginInfo.password, user.password))) {
      throw wrongInformationException;
    }

    const payload: LoggedInUserInterface = {
      sub: user.id,
      email: user.email,
    };

    const accessToken: string = await this.JwtService.signAsync(payload);

    return new LoginResponseDto(accessToken);
  }

  public async validateToken(token: string): Promise<Object> {
    return this.JwtService.verifyAsync(token, {
      secret: this.options.jwtOptions.secret,
    });
  }

  private async validatePassword(
    actualPassword: string,
    encryptedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(actualPassword, encryptedPassword);
  }
}
