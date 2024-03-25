import {
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';
import { UserNotFoundException } from '../authentication/exception/user-not-found.exception';
import { CreateUserDto } from './dto/create-user.dto';
import { UserExistsException } from '../authentication/exception/user-exists.exception';

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

  @HttpCode(HttpStatus.CREATED)
  @Post()
  public async create(@Body() userInfo: CreateUserDto) {
    try {
      return await this.usersService.create(userInfo);
    } catch (e) {
      if (e instanceof UserExistsException) {
        throw new ConflictException(e.message);
      }
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
