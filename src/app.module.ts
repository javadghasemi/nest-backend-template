import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './authentication/entity/user.entity';
import { UsersModule } from './users/users.module';
import { AuthenticationStrategy } from './authentication/enums';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: parseInt(configService.get('DATABASE_PORT', '5432')),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [User],
        synchronize: Boolean(configService.get('DATABASE_SYNCHRONIZE')),
      }),
      inject: [ConfigService],
    }),
    AuthenticationModule.register({
      strategy: AuthenticationStrategy.Bearer,
      jwtOptions: {
        secret: 'THIS IS SECRET KEY',
        signOptions: {
          expiresIn: '60s',
        },
      },
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
