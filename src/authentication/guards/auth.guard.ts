import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { LoggedInUserInterface } from '../interfaces/logged-in-user.interface';
import { AuthenticationServiceInterface } from '../interfaces/authentication-service.interface';

// @Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    // @Inject(AuthenticationServiceInterface)
    private authenticationService: AuthenticationServiceInterface,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token: string | undefined = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.authenticationService.validateToken(token);

      request['user'] = payload as LoggedInUserInterface;
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
