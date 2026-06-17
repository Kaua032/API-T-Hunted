import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConflictException } from '@nestjs/common';

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um novo usuário com sucesso (Padrão AAA)', async () => {
      const createUserDto = { name: 'User', email: 'user@teste.com', password: 'senhaForte123' };
      
      mockUserRepository.findOne.mockResolvedValue(null); 
      mockUserRepository.create.mockReturnValue(createUserDto);
      mockUserRepository.save.mockResolvedValue({ id: 1, ...createUserDto });
      const result = await service.create(createUserDto);

      expect(result).toHaveProperty('id', 1);
      expect(result.email).toEqual('user@teste.com');
      expect(mockUserRepository.findOne).toHaveBeenCalled(); 
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('deve lançar um ConflictException se o email já estiver em uso', async () => {
      const createUserDto = { name: 'User', email: 'user@teste.com', password: 'senhaForte123' };
      
      mockUserRepository.findOne.mockResolvedValue({ id: 1, email: 'user@teste.com' });

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
      
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });
});
