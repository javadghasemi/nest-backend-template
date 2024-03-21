import { AuthenticationService } from './authentication.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { Repository } from 'typeorm';

describe('AuthenticationController', () => {
  let authenticationController: AuthenticationController;
  let authenticationService: AuthenticationService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [AuthenticationService],
    })
      .useMocker((token) => {
        if (token === Repository) {
        }
      })
      .compile();

    authenticationService = moduleRef.get<AuthenticationService>(
      AuthenticationService,
    );
    authenticationController = moduleRef.get<AuthenticationController>(
      AuthenticationController,
    );
  });

  describe('signup', () => {
    it('should ', () => {});
  });
});
