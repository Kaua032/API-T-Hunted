import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsUUID, Min } from 'class-validator';
import { CarCondition } from '../entities/collection.entity';

export class AddCarToCollectionDto {
  @IsUUID()
  @IsNotEmpty({ message: 'O ID do carro é obrigatório.' })
  carId!: string;

  @IsInt()
  @Min(1, { message: 'A quantidade deve ser pelo menos 1.' })
  @IsOptional()
  quantity?: number;

  @IsEnum(CarCondition, { message: 'A condição deve ser "loose" ou "carded".' })
  @IsOptional()
  condition?: CarCondition;
}