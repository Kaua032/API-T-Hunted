import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Car } from './entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { SearchCarDto } from './dto/search-car.dto';
import { MarketSearchService } from '../market-search/market-search.service';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    private readonly marketSearchService: MarketSearchService,
  ) {}

  async create(createCarDto: CreateCarDto) {
    const carExists = await this.carRepository.findOne({
      where: { toyNumber: createCarDto.toyNumber },
    });

    if (carExists) {
      throw new ConflictException(
        'A miniatura com este Toy Number já está cadastrada.',
      );
    }

    const car = this.carRepository.create(createCarDto);
    const savedCar = await this.carRepository.save(car);

    try {
      const marketInfo = await this.getMarketPrice(savedCar.id);

      return {
        ...savedCar,
        averagePrice: marketInfo.averagePrice,
        lastUpdateAt: marketInfo.lastUpdate,
      };
    } catch (error) {
      console.error(
        `Aviso: Carro ${savedCar.id} criado, mas falha ao buscar preço inicial no eBay.`,
      );
      return savedCar;
    }
  }

  async findAll(searchCarDto: SearchCarDto) {
    const {
      name,
      series,
      year,
      isTh,
      isSth,
      page = 1,
      limit = 10,
      toyNumber,
    } = searchCarDto;

    const where: any = {};

    if (toyNumber) where.toyNumber = ILike(`%${toyNumber}%`);
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

  async searchByToyNumber(toyNumber: string) {
    // 1. Busca no banco local (Ignorando maiúsculas/minúsculas com ILike)
    const car = await this.carRepository.findOne({
      where: { toyNumber: ILike(toyNumber) },
    });

    // CENÁRIO A: O carro já existe no banco de dados
    if (car) {
      const now = new Date();
      const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;

      // Verifica se o preço está atualizado (menos de 24h)
      const hasValidPrice = car.lastUpdateAt !== null && car.averagePrice !== null;
      const isPriceFresh =
        hasValidPrice &&
        car.lastUpdateAt &&
        now.getTime() - car.lastUpdateAt.getTime() < TWENTY_FOUR_HOURS_IN_MS;

      if (isPriceFresh) {
        return {
          id: car.id,
          toyNumber: car.toyNumber,
          name: car.name,
          series: car.series,
          year: car.year,
          imageUrl: car.imageUrl,
          averagePrice: car.averagePrice,
          isTh: car.isTh,
          isSth: car.isSth,
          existsInDatabase: true,
        };
      }

      // Se passou de 24h, atualiza o preço antes de retornar
      const marketInfo = await this.getMarketPrice(car.id);
      return {
        ...car,
        averagePrice: marketInfo.averagePrice,
        existsInDatabase: true,
      };
    }

    // CENÁRIO B: O carro NÃO existe no banco de dados (Busca fantasma no eBay)
    const searchQuery = `hot wheels ${toyNumber}`;
    const marketData = await this.marketSearchService.searchMiniature(searchQuery);

    if (marketData.length === 0) {
      return {
        id: null,
        toyNumber,
        name: `Hot Wheels ${toyNumber.toUpperCase()}`,
        series: 'Desconhecida',
        year: new Date().getFullYear(),
        imageUrl: null,
        averagePrice: 0,
        isTh: false,
        isSth: false,
        existsInDatabase: false,
      };
    }

    // Calcula a média dos anúncios do eBay
    const average = this.calculateAveragePrice(marketData);
    
    // Pega a foto do primeiro anúncio válido para ilustrar a tela do usuário
    const firstValidImage = marketData.find((item) => item.imageUrl)?.imageUrl || null;

    // Retorna o objeto "virtual" para o Front-end exibir a opção de cadastro
    return {
      id: null, // Front-end sabe que é nulo, então precisa cadastrar ao clicar em salvar
      toyNumber: toyNumber.toUpperCase(),
      name: marketData[0].title, // Título aproximado do mercado
      series: 'Mainline',
      year: new Date().getFullYear(),
      imageUrl: firstValidImage,
      averagePrice: average,
      isTh: false,
      isSth: false,
      existsInDatabase: false,
    };
  }

  async getMarketPrice(id: string) {
    const car = await this.carRepository.findOne({ where: { id } });

    if (!car) {
      throw new NotFoundException('Carro não encontrado na base de dados.');
    }

    const now = new Date();
    const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;

    const hasValidPrice =
      car.lastUpdateAt !== null && car.averagePrice !== null;

    const isPriceFresh =
      hasValidPrice &&
      car.lastUpdateAt &&
      now.getTime() - car.lastUpdateAt.getTime() < TWENTY_FOUR_HOURS_IN_MS;

    if (isPriceFresh) {
      return {
        source: 'database',
        averagePrice: car.averagePrice,
        lastUpdate: car.lastUpdateAt,
      };
    }

    const searchQuery = `hot wheels ${car.name} ${car.toyNumber}`;

    const marketData =
      await this.marketSearchService.searchMiniature(searchQuery);

    const average = this.calculateAveragePrice(marketData);

    car.averagePrice = average;
    car.lastUpdateAt = now;

    await this.carRepository.save(car);

    return {
      source: 'ebay_api',
      averagePrice: car.averagePrice,
      lastUpdate: car.lastUpdateAt,
      marketDetails: marketData,
    };
  }

  private calculateAveragePrice(items: any[]): number {
    if (!items || items.length === 0) return 0;

    const totalSum = items.reduce(
      (sum, item) => sum + parseFloat(item.price),
      0,
    );
    return parseFloat((totalSum / items.length).toFixed(2));
  }
}
