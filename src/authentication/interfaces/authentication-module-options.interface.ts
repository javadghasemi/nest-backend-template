import { AuthenticationStrategy } from '../enums';
import { JwtModuleOptions } from '@nestjs/jwt';

export interface AuthenticationModuleOptionsInterface {
  strategy?: AuthenticationStrategy;
  jwtOptions?: JwtModuleOptions;
}
