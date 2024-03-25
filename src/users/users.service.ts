import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { UserExistsException } from '../authentication/exception/user-exists.exception';
import { UserNotFoundException } from '../authentication/exception/user-not-found.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

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
  public async getByUsername(username: string): Promise<User> {
    const user: User | null = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new UserNotFoundException('requested username is not found');
    }

    return user;
  }

  /**
   * @summary Create new user
   * @param userInfo {CreateUserDto}
   * @return Promise<CreateUserResponseDto>
   */
  public async create(userInfo: CreateUserDto): Promise<CreateUserResponseDto> {
    await this.checkEmailAndUsernameExists(userInfo.username, userInfo.email);

    const password = await bcrypt.hash(userInfo.password, 10);

    const user = new User(
      userInfo.firstName,
      userInfo.lastName,
      userInfo.email,
      userInfo.username,
      password,
    );

    await this.userRepository.save(user);

    return new CreateUserResponseDto(
      user.firstName,
      user.lastName,
      user.email,
      user.username,
    );
  }

  public async delete(username: string): Promise<void> {
    const user: User = await this.getByUsername(username);

    await this.userRepository.delete(user);
  }

  /**
   * @summary Check email exists in database
   * @param email {string}
   * @private
   */
  private async checkEmailExists(email: string): Promise<boolean> {
    return this.userRepository.existsBy({ email });
  }

  /**
   * @summary Check Username exists in database
   * @param username
   * @private
   */
  private async checkUsernameExists(username: string): Promise<boolean> {
    return this.userRepository.existsBy({ username });
  }

  private async checkEmailAndUsernameExists(username: string, email: string) {
    const checkInfoDetails = [
      {
        checkerName: 'username',
        method: this.checkUsernameExists(username),
      },
      {
        checkerName: 'email',
        method: this.checkEmailExists(email),
      },
    ];

    const rawResponse = await Promise.allSettled([
      checkInfoDetails[0].method,
      checkInfoDetails[1].method,
    ]);

    const response = rawResponse.filter(
      (res) => res.status === 'fulfilled',
    ) as PromiseFulfilledResult<any>[];

    response.forEach((resultElement, index) => {
      if (resultElement.value) {
        throw new UserExistsException(checkInfoDetails[index].checkerName);
      }
    });
  }
}
