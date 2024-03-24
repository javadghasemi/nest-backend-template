import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../authentication/entity/user.entity';
import { UserNotFoundException } from '../authentication/exception/user-not-found.exception';

@Controller({
  version: '1',
  path: 'users',
})
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  public getAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':username')
  public async getOne(@Param('username') username: string): Promise<User> {
    try {
      return await this.usersService.getByUsername(username);
    } catch (e) {
      if (e instanceof UserNotFoundException) {
        throw new NotFoundException(e.message);
      }

      throw new InternalServerErrorException();
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':username')
  public async delete(@Param('username') username: string): Promise<void> {
    try {
      await this.usersService.delete(username);
    } catch (e) {
      if (e instanceof UserNotFoundException) {
        throw new NotFoundException(e.message);
      }

      throw new InternalServerErrorException();
    }
  }
}
