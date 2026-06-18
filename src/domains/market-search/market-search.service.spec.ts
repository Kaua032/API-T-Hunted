import { Test, TestingModule } from '@nestjs/testing';
import { MarketSearchService } from './market-search.service';

describe('MarketSearchService', () => {
  let service: MarketSearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketSearchService],
    }).compile();

    service = module.get<MarketSearchService>(MarketSearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
