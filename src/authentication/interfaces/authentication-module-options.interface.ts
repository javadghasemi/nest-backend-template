import { AuthenticationStrategy } from '../enums';
import { JwtModuleOptions } from '@nestjs/jwt';

export interface AuthenticationModuleOptionsInterface {
  global?: boolean;
  strategy?: AuthenticationStrategy;
  jwtOptions?: JwtModuleOptions;
}
