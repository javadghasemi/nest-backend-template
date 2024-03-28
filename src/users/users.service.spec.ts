import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserNotFoundException } from './exception/user-not-found.exception';
import { expect } from '@jest/globals';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  const userRepositoryToken: string | Function = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: userRepositoryToken,
          useClass: Repository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(userRepositoryToken);
  });

  describe('getByEmail', () => {
    it('should return existing user', async () => {
      const userEmail: string = 'found@gmail.com';
      const expectedUser = {
        id: 1,
        email: userEmail,
        password: 'password',
      } as User;

      jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValueOnce(expectedUser);

      const result = await usersService.getByEmail(userEmail);

      expect(result).toBe(expectedUser);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: userEmail,
      });
    });

    it('should throw error if email is not exists', async () => {
      const notFoundUserEmail: string = 'test@gmail.com';
      const expectedError: UserNotFoundException = new UserNotFoundException();

      jest.spyOn(userRepository, 'findOneBy').mockRejectedValue(expectedError);

      try {
        await usersService.getByEmail(notFoundUserEmail);
      } catch (e) {
        expect(e).toBeInstanceOf(UserNotFoundException);
        expect(userRepository.findOneBy).toHaveBeenCalledWith({
          email: notFoundUserEmail,
        });
        expect(e.message).toBe(expectedError.message);
      }
    });
  });
});
