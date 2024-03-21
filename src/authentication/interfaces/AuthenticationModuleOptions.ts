import { AuthenticationStrategy } from '../enums';
import { JwtModuleOptions } from '@nestjs/jwt';

export interface AuthenticationModuleOptions {
  strategy?: AuthenticationStrategy;
  jwtOptions?: JwtModuleOptions;
}
