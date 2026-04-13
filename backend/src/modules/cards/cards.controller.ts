import { Controller, Get, Param } from '@nestjs/common';
import { CardsService } from './cards.service';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}
  @Get(':id')
  getCards(@Param('id') id: string) {
    return this.cardsService.getCards(id);
  }
}
