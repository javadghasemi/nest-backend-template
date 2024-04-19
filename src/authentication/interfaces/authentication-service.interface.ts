import { SignupRequestDto } from '../dto/signup-request.dto';
import { CreateUserResponseDto } from '../../users/dto/create-user-response.dto';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { LoggedInUserInterface } from './logged-in-user.interface';

export interface AuthenticationServiceInterface {
  signup(userInfo: SignupRequestDto): Promise<CreateUserResponseDto>;
  login(userInfo: LoginRequestDto): Promise<LoginResponseDto>;
  validateToken(token: string): Promise<LoggedInUserInterface>;
}

export const AuthenticationServiceInterface = Symbol(
  'AuthenticationServiceInterface',
);
