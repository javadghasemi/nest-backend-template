import { DynamicModule, Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AUTHENTICATION_MODULE_OPTIONS } from './constants';
import { AuthenticationModuleOptionsInterface } from './interfaces/authentication-module-options.interface';
import { AuthenticationStrategy } from './enums';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './auth-strategy/local.strategy';

@Module({
  imports: [UsersModule],
  providers: [AuthenticationService],
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
})
export class AuthenticationModule {
  private static options: AuthenticationModuleOptionsInterface;

  static forRoot(
    options: AuthenticationModuleOptionsInterface = {},
  ): DynamicModule {
    this.options = options;

    const imports: any[] = [UsersModule];
    const providers: any[] = [
      {
        provide: AUTHENTICATION_MODULE_OPTIONS,
        useValue: options,
      },
    ];

    const strategy = this.strategyFactory();

    imports.push(...strategy.imports);
    providers.push(...strategy.providers);

    return {
      global: options.global || false,
      module: AuthenticationModule,
      imports,
      providers: [
        {
          provide: AUTHENTICATION_MODULE_OPTIONS,
          useValue: options,
        },
        ...providers,
      ],
      controllers: [AuthenticationController],
      exports: [AuthenticationService],
    };
  }

  private static strategyFactory(): {
    providers: any[];
    imports: any[];
  } {
    const result = { imports: [], providers: [] };

    switch (this.options.strategy) {
      case AuthenticationStrategy.Bearer:
        result.imports.push(JwtModule.register(this.options.jwtOptions));
        result.providers.push(AuthenticationService);
        break;
      case AuthenticationStrategy.Session:
        result.imports.push(PassportModule);
        result.providers.push(AuthenticationService, LocalStrategy);
        break;

      default:
        throw new Error('Unknown authentication strategy');
    }

    return result;
  }
}
