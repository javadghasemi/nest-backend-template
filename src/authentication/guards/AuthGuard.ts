import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticationModuleOptions } from '../interfaces/AuthenticationModuleOptions';
import { AUTHENTICATION_MODULE_OPTIONS } from '../constants';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AUTHENTICATION_MODULE_OPTIONS)
    private authenticationModuleOptions: AuthenticationModuleOptions,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token: string | undefined = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.authenticationModuleOptions.jwtOptions.secret,
      });

      request['user'] = payload;
    } catch (e) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
