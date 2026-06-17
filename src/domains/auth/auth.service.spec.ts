import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  
  const mockUsersService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('deve retornar um access_token quando as credenciais estiverem corretas (Padrão AAA)', async () => {
      const email = 'teste@exemplo.com';
      const pass = 'senhaValida123';
      const mockUser = { id: 1, email: email, password: 'senhaCriptografadaNoBanco' };
      const mockToken = 'meu.token.jwt.simulado';

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue(mockToken);

      const result = await service.login(email, pass);

      expect(result).toEqual({ access_token: mockToken });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(pass, mockUser.password);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({ sub: mockUser.id, email: mockUser.email });
    });

    it('deve lançar UnauthorizedException se o usuário não for encontrado', async () => {
      const email = 'inexistente@exemplo.com';
      const pass = 'qualquerSenha';

      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.login(email, pass)).rejects.toThrow(UnauthorizedException);
      
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('deve lançar UnauthorizedException se a senha for inválida', async () => {
      const email = 'teste@exemplo.com';
      const pass = 'senhaErrada';
      const mockUser = { id: 1, email: email, password: 'senhaCriptografadaNoBanco' };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(email, pass)).rejects.toThrow(UnauthorizedException);
      
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});