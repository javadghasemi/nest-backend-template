import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './authentication/entity/user.entity';
import { UsersModule } from './users/users.module';
import { AuthenticationStrategy } from './authentication/enums';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: '123456',
      database: 'store_api',
      entities: [User],
      synchronize: true,
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
