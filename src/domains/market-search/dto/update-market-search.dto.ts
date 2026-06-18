import { PartialType } from '@nestjs/mapped-types';
import { CreateMarketSearchDto } from './create-market-search.dto';

export class UpdateMarketSearchDto extends PartialType(CreateMarketSearchDto) {}
