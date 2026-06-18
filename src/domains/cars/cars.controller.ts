import { Controller, Get, Post, Body, Query, UseGuards, Param, ParseUUIDPipe } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { SearchCarDto } from './dto/search-car.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createCarDto: CreateCarDto) {
    return await this.carsService.create(createCarDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() searchCarDto: SearchCarDto) {
    return await this.carsService.findAll(searchCarDto);
  }

  @Get('search/:toyNumber')
  async searchByToyNumber(@Param('toyNumber') toyNumber: string) {
    return this.carsService.searchByToyNumber(toyNumber);
  }

  @Get(':id/market-price')
  async getMarketPrice(@Param('id', ParseUUIDPipe) id: string) {
    return this.carsService.getMarketPrice(id);
  }
}
