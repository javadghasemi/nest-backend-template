import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../authentication/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { UserExistsException } from '../authentication/exception/user-exists.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * @summary Get user by email address
   * @param email {string}
   * @return Promise<User>
   */
  public getByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  /**
   * @summary Get user by username
   * @param username {string}
   * @return Promise<User>
   */
  public getByUsername(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  /**
   * @summary Create new user
   * @param userInfo {CreateUserDto}
   * @return Promise<CreateUserResponseDto>
   */
  public async create(userInfo: CreateUserDto): Promise<CreateUserResponseDto> {
    await Promise.all([
      this.checkEmailExists(userInfo.email),
      this.checkUsernameExists(userInfo.username),
    ]);

    const user = new User();

    const password = await bcrypt.hash(userInfo.password, 10);

    user.firstName = userInfo.firstName;
    user.lastName = userInfo.lastName;
    user.email = userInfo.email;
    user.username = userInfo.username;
    user.password = password;

    await this.userRepository.save(user);

    return this.manipulateResponse(userInfo);
  }

  /**
   * @summary Check email exists in database
   * @param email {string}
   * @private
   */
  private async checkEmailExists(email: string): Promise<void> {
    const user: User | null = await this.getByEmail(email);

    if (user) {
      throw new UserExistsException('email');
    }
  }

  /**
   * @summary Check Username exists in database
   * @param username
   * @private
   */
  private async checkUsernameExists(username: string): Promise<void> {
    const user: User | null = await this.getByUsername(username);

    if (user) {
      throw new UserExistsException('username');
    }
  }

  /**
   * @summary Manipulate create user response
   * @param userInfo {CreateUserDto}
   * @private
   * @return CreateUserResponseDto
   */
  private manipulateResponse(userInfo: CreateUserDto): CreateUserResponseDto {
    const response = new CreateUserResponseDto();
    response.firstName = userInfo.firstName;
    response.lastName = userInfo.lastName;
    response.email = userInfo.email;
    response.username = userInfo.username;

    return response;
  }
}
