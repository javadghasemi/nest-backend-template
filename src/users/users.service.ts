import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entity/user.entity';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { UserExistsException } from './exception/user-exists.exception';
import { UserNotFoundException } from './exception/user-not-found.exception';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { UpdateUserResponseDto } from './dto/update-user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  public getById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  /**
   * @summary Get user by email address
   * @param email {string}
   * @return Promise<User>
   */
  public async getByEmail(email: string): Promise<User> {
    const user: User | null = await this.userRepository.findOneBy({ email });

    if (!user) throw new UserNotFoundException('email');

    return user;
  }

  /**
   * @summary Create new user
   * @param userInfo {CreateUserRequestDto}
   * @return Promise<CreateUserResponseDto>
   */
  public async create(
    userInfo: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    await this.checkIdentificationExists(userInfo.email);

    const password = await this.hashPassword(userInfo.password);

    const user = new User(
      userInfo.firstName,
      userInfo.lastName,
      userInfo.email,
      password,
    );

    await this.userRepository.save(user);

    return new CreateUserResponseDto(user.firstName, user.lastName, user.email);
  }

  public async update(
    email: string,
    userInfo: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    const user = await this.getByEmail(email);

    if (userInfo.email !== user.email) {
      await this.checkIdentificationExists(userInfo.email);
    }

    const password = await this.hashPassword(userInfo.password);

    const updatedUser = await this.userRepository.save({
      id: user.id,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      password,
    });

    return new UpdateUserResponseDto(
      updatedUser.firstName,
      updatedUser.lastName,
      updatedUser.email,
    );
  }

  public async delete(email: string): Promise<void> {
    const user: User = await this.getByEmail(email);

    await this.userRepository.remove(user);
  }

  /**
   * @summary Check email exists in database
   * @param email {string}
   * @private
   */
  private async checkEmailExists(email: string): Promise<boolean> {
    return this.userRepository.existsBy({ email });
  }

  private async checkIdentificationExists(email: string) {
    const existsStatus = await this.checkEmailExists(email);

    if (existsStatus) throw new UserExistsException('email');
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
