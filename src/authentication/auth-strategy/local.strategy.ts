import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Inject, Injectable } from '@nestjs/common';
import { AuthenticationServiceInterface } from '../interfaces/authentication-service.interface';
import { LoginRequestDto } from '../dto/login-request.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AuthenticationServiceInterface)
    private authenticationService: AuthenticationServiceInterface,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    await this.authenticationService.login({
      email,
      password,
    } as LoginRequestDto);
    return {
      email,
    };
  }
}
