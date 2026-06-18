import { Test, TestingModule } from '@nestjs/testing';
import { MarketSearchController } from './market-search.controller';
import { MarketSearchService } from './market-search.service';

describe('MarketSearchController', () => {
  let controller: MarketSearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketSearchController],
      providers: [MarketSearchService],
    }).compile();

    controller = module.get<MarketSearchController>(MarketSearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
