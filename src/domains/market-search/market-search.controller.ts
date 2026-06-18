import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MarketSearchService } from './market-search.service';
import { CreateMarketSearchDto } from './dto/create-market-search.dto';
import { UpdateMarketSearchDto } from './dto/update-market-search.dto';

@Controller('market-search')
export class MarketSearchController {
  constructor(private readonly marketSearchService: MarketSearchService) {}

  @Post()
  create(@Body() createMarketSearchDto: CreateMarketSearchDto) {
    return this.marketSearchService.create(createMarketSearchDto);
  }

  @Get()
  findAll() {
    return this.marketSearchService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marketSearchService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarketSearchDto: UpdateMarketSearchDto) {
    return this.marketSearchService.update(+id, updateMarketSearchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketSearchService.remove(+id);
  }
}
