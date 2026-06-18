import { Module } from '@nestjs/common';
import { MarketSearchService } from './market-search.service';
import { MarketSearchController } from './market-search.controller';

@Module({
  controllers: [MarketSearchController],
  providers: [MarketSearchService],
})
export class MarketSearchModule {}
