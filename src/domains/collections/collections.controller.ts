import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Delete,
  Param,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { AddCarToCollectionDto } from './dto/add-car.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  async addCar(@Req() req: any, @Body() addCarDto: AddCarToCollectionDto) {
    const userId = req.user.userId;
    return await this.collectionsService.addCar(userId, addCarDto);
  }

  @Patch(':id/quantity')
  async updateQuantity(
    @Req() req: any,
    @Param('id') collectionId: string,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return await this.collectionsService.updateQuantity(
      req.user.userId,
      collectionId,
      quantity,
    );
  }

  @Delete(':id')
  async removeCar(@Req() req: any, @Param('id') collectionId: string) {
    await this.collectionsService.removeCar(req.user.id, collectionId);
    return { message: 'Miniatura removida da coleção com sucesso.' };
  }

  @Get()
  async getMyCollection(@Req() req: any) {
    const userId = req.user.userId; // <-- Use a propriedade correta do seu JWT aqui
    return await this.collectionsService.getMyCollection(userId);
  }
}
