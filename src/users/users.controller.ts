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
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';
import { UserNotFoundException } from '../authentication/exception/user-not-found.exception';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UserExistsException } from '../authentication/exception/user-exists.exception';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { UpdateUserResponseDto } from './dto/update-user-response.dto';

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
  @Get(':email')
  public async getOne(@Param('email') email: string): Promise<User> {
    try {
      return await this.usersService.getByEmail(email);
    } catch (e) {
      if (e instanceof UserNotFoundException) {
        throw new NotFoundException(e.message);
      }

      throw new InternalServerErrorException();
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  public async create(
    @Body() userInfo: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    try {
      return await this.usersService.create(userInfo);
    } catch (e) {
      if (e instanceof UserExistsException) {
        throw new ConflictException(e.message);
      }
    }
  }

  @Put(':email')
  public async update(
    @Param('email') email: string,
    @Body() userInfo: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    return await this.usersService.update(email, userInfo);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':email')
  public async delete(@Param('email') email: string): Promise<void> {
    try {
      await this.usersService.delete(email);
    } catch (e) {
      if (e instanceof UserNotFoundException) {
        throw new NotFoundException(e.message);
      }

      throw new InternalServerErrorException();
    }
  }
}
