import { CardEntity } from '../card.entity';
import { FileResponseDto } from '../../storage/dto/file.response.dto';

export class CardDetailsResponseDto {
  id: string;
  position: number;
  term: string;
  termDescription: string | null;
  termImage: FileResponseDto | null;
  definition: string;
  definitionImage: FileResponseDto | null;
  textColor: string | null;
  backgroundColor: string | null;

  constructor(entity: CardEntity) {
    this.id = entity.id;
    this.position = entity.position;
    this.term = entity.term;
    this.termDescription = entity.termDescription || null;
    this.termImage = entity.termImage
      ? new FileResponseDto(entity.termImage)
      : null;
    this.definition = entity.definition;
    this.definitionImage = entity.definitionImage
      ? new FileResponseDto(entity.definitionImage)
      : null;
    this.textColor = entity.textColor || null;
    this.backgroundColor = entity.backgroundColor || null;
  }
}
