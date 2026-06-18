import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { Collection } from './entities/collection.entity';
import { Car } from '../cars/entities/car.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Collection, Car])],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
