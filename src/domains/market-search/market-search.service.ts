import { Injectable } from '@nestjs/common';
import { CreateMarketSearchDto } from './dto/create-market-search.dto';
import { UpdateMarketSearchDto } from './dto/update-market-search.dto';

@Injectable()
export class MarketSearchService {
  create(createMarketSearchDto: CreateMarketSearchDto) {
    return 'This action adds a new marketSearch';
  }

  findAll() {
    return `This action returns all marketSearch`;
  }

  findOne(id: number) {
    return `This action returns a #${id} marketSearch`;
  }

  update(id: number, updateMarketSearchDto: UpdateMarketSearchDto) {
    return `This action updates a #${id} marketSearch`;
  }

  remove(id: number) {
    return `This action removes a #${id} marketSearch`;
  }
}
