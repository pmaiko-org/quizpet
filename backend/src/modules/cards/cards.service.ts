import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from './card.entity';
import { CardDetailsResponseDto } from './dto/card-details.response.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardsRepository: Repository<CardEntity>,
  ) {}

  async getCards(setId: string) {
    const cards = await this.cardsRepository.find({
      where: { set: { id: setId } },
      order: { position: 'ASC' },
    });

    if (cards) return cards.map((card) => new CardDetailsResponseDto(card));
  }
}
