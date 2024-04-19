import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SignupRequestDto } from './dto/signup-request.dto';
import { AuthenticationService } from './authentication.service';
import { UserExistsException } from '../users/exception/user-exists.exception';
import { CreateUserResponseDto } from '../users/dto/create-user-response.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { WrongLoginInfoException } from './exception/wrong-login-info.exception';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthenticationServiceInterface } from './interfaces/authentication-service.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller({
  version: '1',
  path: 'authentication',
})
export class AuthenticationController {
  constructor(
    @Inject(AuthenticationServiceInterface)
    private authenticationService: AuthenticationServiceInterface,
  ) {}

  @Post('signup')
  public async signup(
    @Body(new ValidationPipe()) signupInfo: SignupRequestDto,
  ): Promise<CreateUserResponseDto> {
    try {
      return await this.authenticationService.signup(signupInfo);
    } catch (e) {
      if (e instanceof UserExistsException) {
        throw new ConflictException(e.message);
      }

      throw e;
    }
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ValidationPipe()) loginInfo: LoginRequestDto,
    @Request() request,
  ): Promise<LoginResponseDto> {
    try {
      return request.user;
    } catch (e) {
      if (e instanceof WrongLoginInfoException) {
        throw new UnauthorizedException(e.message);
      }
    }
  }

  @Get('protected')
  @UseGuards(AuthGuard('local'))
  protected() {
    return 'ok';
  }
}
