import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection, CarCondition } from './entities/collection.entity';
import { AddCarToCollectionDto } from './dto/add-car.dto';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
  ) {}

  async addCar(userId: string, addCarDto: AddCarToCollectionDto): Promise<Collection> {
    const { carId, quantity = 1, condition = CarCondition.LOOSE } = addCarDto;

    let collectionItem = await this.collectionRepository.findOne({
      where: {
        user: { id: userId },
        car: { id: carId },
        condition: condition,
      },
    });

    if (collectionItem) {
      collectionItem.quantity += quantity;
      return await this.collectionRepository.save(collectionItem);
    }

    collectionItem = this.collectionRepository.create({
      user: { id: userId },
      car: { id: carId },
      quantity,
      condition,
    });

    return await this.collectionRepository.save(collectionItem);
  }

  async updateQuantity(userId: string, collectionId: string, quantity: number): Promise<Collection> {
    const item = await this.collectionRepository.findOne({
      where: { id: collectionId, user: { id: userId } },
    });

    if (!item) {
      throw new NotFoundException('Item não encontrado na sua coleção.');
    }

    item.quantity = quantity;
    return await this.collectionRepository.save(item);
  }

  async removeCar(userId: string, collectionId: string): Promise<void> {
    const result = await this.collectionRepository.delete({
      id: collectionId,
      user: { id: userId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Item não encontrado na sua coleção.');
    }
  }

  async getMyCollection(userId: string): Promise<Collection[]> {
    return await this.collectionRepository.find({
      where: { user: { id: userId } },
      relations: { car: true },
      order: { createdAt: 'DESC' },
    });
  }
}
