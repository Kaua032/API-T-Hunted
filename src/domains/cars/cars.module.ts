import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { Car } from './entities/car.entity';
import { MarketSearchModule } from '../market-search/market-search.module';

@Module({
  imports: [TypeOrmModule.forFeature([Car]), MarketSearchModule],
  controllers: [CarsController],
  providers: [CarsService],
})
export class CarsModule {}
