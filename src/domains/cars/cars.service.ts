import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Car } from './entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { SearchCarDto } from './dto/search-car.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  async create(createCarDto: CreateCarDto): Promise<Car> {
    const carExists = await this.carRepository.findOne({
      where: { toyNumber: createCarDto.toyNumber },
    });

    if (carExists) {
      throw new ConflictException('A miniatura com este Toy Number já está cadastrada.');
    }

    const car = this.carRepository.create(createCarDto);
    return await this.carRepository.save(car);
  }

  async findAll(searchCarDto: SearchCarDto) {
    const { name, series, year, isTh, isSth, page = 1, limit = 10 } = searchCarDto;

    const where: any = {};

    if (name) where.name = ILike(`%${name}%`);
    if (series) where.series = ILike(`%${series}%`);
    if (year) where.year = year;
    if (isTh !== undefined) where.isTh = isTh;
    if (isSth !== undefined) where.isSth = isSth;

    const [data, total] = await this.carRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { year: 'DESC', name: 'ASC' },
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }
}
