import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SignupRequestDto } from './dto/signup-request.dto';
import { AuthenticationService } from './authentication.service';
import { UserExistsException } from './exception/user-exists.exception';
import { CreateUserResponseDto } from '../users/dto/create-user-response.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { WrongLoginInfoException } from './exception/wrong-login-info.exception';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthGuard } from './guards/AuthGuard';

@Controller({
  version: '1',
  path: 'authentication',
})
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

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

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ValidationPipe()) loginInfo: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    try {
      return await this.authenticationService.login(loginInfo);
    } catch (e) {
      if (e instanceof WrongLoginInfoException) {
        throw new UnauthorizedException(e.message);
      }
    }
  }

  @Get('protected')
  @UseGuards(AuthGuard)
  protected() {
    return 'ok';
  }
}
