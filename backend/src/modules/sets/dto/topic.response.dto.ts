import { TopicEntity } from '../entity/topic.entity';

export class TopicResponseDto {
  id: string;
  label: string;
  value: string;
  icon: string;
  description: string;

  constructor(entity: TopicEntity) {
    this.id = entity.id;
    this.label = entity.label;
    this.value = entity.value;
    this.icon = entity.icon;
    this.description = entity.description;
  }
}
