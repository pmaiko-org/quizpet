import { EnglishLevelEntity } from "../../entity/english-level.entity";

export class EnglishLevelResponseDto {
  id: string;
  label: string;
  value: string;
  description: string;

  constructor(entity: EnglishLevelEntity) {
    this.id = entity.id;
    this.label = entity.label;
    this.value = entity.value;
    this.description = entity.description;
  }
}
