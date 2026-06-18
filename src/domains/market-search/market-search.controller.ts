import {
  Controller,
  Get,
  Query,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { MarketSearchService } from './market-search.service';

@Controller('market-search')
@UseInterceptors(CacheInterceptor)
export class MarketSearchController {
  constructor(private readonly marketSearchService: MarketSearchService) {}

  @Get()
  @CacheTTL(300)
  async search(@Query('query') query: string) {
    if (!query) {
      throw new BadRequestException(
        'O parâmetro de busca "query" é obrigatório.',
      );
    }

    const optimizedQuery = query.toLowerCase().includes('hot wheels')
      ? query
      : `hot wheels ${query}`;

    return await this.marketSearchService.searchMiniature(optimizedQuery);
  }
}
