import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class SearchCarDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  series?: string;

  @IsOptional()
  @Type(() => Number) // Converte a string da URL para Número
  @IsNumber()
  year?: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true') // Converte a string 'true' para Booleano
  @IsBoolean()
  isTh?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isSth?: boolean;
}