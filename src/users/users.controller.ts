import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../authentication/entity/user.entity';
import { UserNotFoundException } from '../authentication/exception/user-not-found.exception';

@Controller('users@1')
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
}
