import { DynamicModule, Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AUTHENTICATION_MODULE_OPTIONS } from './constants';
import { AuthenticationModuleOptions } from './interfaces/AuthenticationModuleOptions';
import { AuthenticationStrategy } from './enums';

@Module({
  imports: [UsersModule],
  providers: [AuthenticationService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {
  static register(options: AuthenticationModuleOptions = {}): DynamicModule {
    const imports: any[] = [UsersModule];

    if (options.strategy === AuthenticationStrategy.Bearer) {
      imports.push(JwtModule.register(options.jwtOptions));
    }

    return {
      module: AuthenticationModule,
      imports,
      providers: [
        {
          provide: AUTHENTICATION_MODULE_OPTIONS,
          useValue: options,
        },
        AuthenticationService,
      ],
      controllers: [AuthenticationController],
      exports: [AuthenticationService],
    };
  }
}
