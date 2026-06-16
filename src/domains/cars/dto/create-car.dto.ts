import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsUrl, Min } from 'class-validator';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty({ message: 'O código da miniatura (toy number) é obrigatório.' })
  toyNumber!: string;

  @IsString()
  @IsNotEmpty({ message: 'O nome da miniatura é obrigatório.' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'A série da miniatura é obrigatória.' })
  series!: string;

  @IsNumber()
  @Min(1968, { message: 'O ano não pode ser inferior a 1968 (Ano de lançamento da Hot Wheels).' })
  year!: number;

  @IsUrl({}, { message: 'Forneça uma URL válida para a imagem.' })
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isTh?: boolean;

  @IsBoolean()
  @IsOptional()
  isSth?: boolean;
}