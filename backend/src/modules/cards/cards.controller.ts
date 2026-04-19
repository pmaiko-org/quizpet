import { Controller, Get, Param } from "@nestjs/common";
import { CardsService } from "./cards.service";
import { CardDetailsResponseDto } from "./dto/card-details.response.dto";

@Controller("cards")
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}
  @Get(":id")
  getCards(@Param("id") id: string): Promise<CardDetailsResponseDto[]> {
    return this.cardsService.getCards(id);
  }
}
