import { DynamicModule, Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AUTHENTICATION_MODULE_OPTIONS } from './constants';
import { AuthenticationModuleOptionsInterface } from './interfaces/authentication-module-options.interface';
import { AuthenticationStrategy } from './enums';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './auth-strategy/local.strategy';
import { AuthenticationSessionService } from './authentication-session.service';
import { AuthenticationService } from './authentication.service';
import { AuthenticationServiceInterface } from './interfaces/authentication-service.interface';

@Module({
  imports: [UsersModule],
  controllers: [AuthenticationController],
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
    };
  }

  private static strategyFactory(): {
    imports: any[];
    providers: any[];
    exports: any[];
  } {
    const result = { imports: [], providers: [], exports: [] };

    switch (this.options.strategy) {
      case AuthenticationStrategy.Bearer:
        result.imports.push(JwtModule.register(this.options.jwtOptions));
        result.providers.push({
          provide: AuthenticationServiceInterface,
          useClass: AuthenticationService,
        });
        result.exports.push({
          provide: AuthenticationServiceInterface,
          useClass: AuthenticationService,
        });
        break;

      case AuthenticationStrategy.Session:
        result.imports.push(PassportModule);
        result.providers.push(
          {
            provide: AuthenticationServiceInterface,
            useClass: AuthenticationSessionService,
          },
          LocalStrategy,
        );
        result.exports.push({
          provide: AuthenticationServiceInterface,
          useClass: AuthenticationSessionService,
        });

        break;

      default:
        throw new Error('Unknown authentication strategy');
    }

    return result;
  }
}
