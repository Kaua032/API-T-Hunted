import { Test, TestingModule } from '@nestjs/testing';
import { CollectionsService } from './collections.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Collection, CarCondition } from './entities/collection.entity';
import { NotFoundException } from '@nestjs/common';

const mockCollectionRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  find: jest.fn(),
};

describe('CollectionsService', () => {
  let service: CollectionsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollectionsService,
        {
          provide: getRepositoryToken(Collection),
          useValue: mockCollectionRepository,
        },
      ],
    }).compile();

    service = module.get<CollectionsService>(CollectionsService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('addCar', () => {
    it('deve somar a quantidade se o carro já existir na coleção com a mesma condição (Padrão AAA)', async () => {
      const userId = 'user-123';
      const addCarDto = { carId: 'car-456', quantity: 2, condition: CarCondition.LOOSE };
      const itemExistente = { id: 'col-789', quantity: 1, condition: CarCondition.LOOSE };

      mockCollectionRepository.findOne.mockResolvedValue(itemExistente);
      mockCollectionRepository.save.mockResolvedValue({ ...itemExistente, quantity: 3 });

      const result = await service.addCar(userId, addCarDto);

      expect(result.quantity).toBe(3);
      expect(mockCollectionRepository.findOne).toHaveBeenCalled();
      expect(mockCollectionRepository.create).not.toHaveBeenCalled();
      expect(mockCollectionRepository.save).toHaveBeenCalledWith({ ...itemExistente, quantity: 3 });
    });

    it('deve criar um novo registro se o carro não existir na coleção', async () => {
      const userId = 'user-123';
      const addCarDto = { carId: 'car-456', quantity: 1, condition: CarCondition.LOOSE };

      mockCollectionRepository.findOne.mockResolvedValue(null);
      mockCollectionRepository.create.mockReturnValue(addCarDto);
      mockCollectionRepository.save.mockResolvedValue({ id: 'col-novo', ...addCarDto });

      const result = await service.addCar(userId, addCarDto);

      expect(result).toHaveProperty('id', 'col-novo');
      expect(mockCollectionRepository.create).toHaveBeenCalled();
      expect(mockCollectionRepository.save).toHaveBeenCalled();
    });
  });

  describe('updateQuantity', () => {
    it('deve atualizar a quantidade de um item existente', async () => {
      const itemExistente = { id: 'col-789', quantity: 1 };
      mockCollectionRepository.findOne.mockResolvedValue(itemExistente);
      mockCollectionRepository.save.mockResolvedValue({ ...itemExistente, quantity: 5 });

      const result = await service.updateQuantity('user-123', 'col-789', 5);

      expect(result.quantity).toBe(5);
      expect(mockCollectionRepository.save).toHaveBeenCalled();
    });

    it('deve lançar NotFoundException se tentar atualizar um item que não existe', async () => {
      mockCollectionRepository.findOne.mockResolvedValue(null);

      await expect(service.updateQuantity('user-123', 'col-000', 5)).rejects.toThrow(NotFoundException);
      expect(mockCollectionRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('removeCar', () => {
    it('deve remover um item com sucesso', async () => {
      mockCollectionRepository.delete.mockResolvedValue({ affected: 1 });

      await service.removeCar('user-123', 'col-789');

      expect(mockCollectionRepository.delete).toHaveBeenCalledWith({ id: 'col-789', user: { id: 'user-123' } });
    });

    it('deve lançar NotFoundException se o item não for encontrado ao deletar', async () => {
      mockCollectionRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.removeCar('user-123', 'col-000')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getMyCollection', () => {
    it('deve retornar a coleção do usuário', async () => {
      const mockLista = [{ id: 'col-1', car: { id: 'car-1' } }, { id: 'col-2', car: { id: 'car-2' } }];
      mockCollectionRepository.find.mockResolvedValue(mockLista);

      const result = await service.getMyCollection('user-123');

      expect(result).toEqual(mockLista);
      expect(mockCollectionRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 'user-123' } },
        relations: { car: true },
        order: { createdAt: 'DESC' },
      });
    });
  });
});
