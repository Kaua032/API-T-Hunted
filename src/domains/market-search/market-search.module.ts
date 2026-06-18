import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { MarketSearchService } from './market-search.service';
import { MarketSearchController } from './market-search.controller';

@Module({
  imports: [
    HttpModule,
    CacheModule.register({
      ttl: 600000,
      max: 100,
    }),
  ],
  controllers: [MarketSearchController],
  providers: [MarketSearchService],
  exports: [MarketSearchService],
})
export class MarketSearchModule {}
