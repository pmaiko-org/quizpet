import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
import { TopicEntity } from './entity/topic.entity';
import { SetEntity } from './entity/set.entity';
import { CreateSetDto } from './dto/create-set.dto';
import { CardEntity } from '../cards/card.entity';
import { SetListItemResponseDto } from './dto/set-list-item.response.dto';
import { UpdateSetDto } from './dto/update-set.dto';
import { UpdateCardDto } from '../cards/dto/update-card.dto';
import { SetDetailsResponseDto } from './dto/set-details.response.dto';
import { CreateCardDto } from '../cards/dto/create-card.dto';

@Injectable()
export class SetsService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(TopicEntity)
    private readonly topicRepository: Repository<TopicEntity>,
    @InjectRepository(SetEntity)
    private readonly setRepository: Repository<SetEntity>,
  ) {}

  async getSets() {
    const sets = await this.setRepository.find();

    return sets.map((set) => new SetListItemResponseDto(set));
  }

  async getSet(setId: string) {
    const set = await this.setRepository.findOne({
      where: { id: setId },
      relations: {
        cards: true,
      },
      order: {
        cards: { position: 'ASC' },
      },
    });
    if (set) return new SetDetailsResponseDto(set);
  }

  async createSet(userId: string, createSetDto: CreateSetDto) {
    const topics = await this.getValidatedTopics(createSetDto.topicIds);
    const cards = this.mapCards(createSetDto.cards);

    const set = this.setRepository.create({
      name: createSetDto.name,
      description: createSetDto.description,
      topics,
      user: { id: userId },
      cards,
    });

    return this.setRepository.save(set);
  }

  async updateSet(userId: string, setId: string, updateSetDto: UpdateSetDto) {
    const set = await this.setRepository.findOne({
      where: {
        id: setId,
        user: { id: userId },
      },
      relations: {
        cards: true,
      },
    });

    if (!set) {
      throw new NotFoundException(`Set "${setId}" not found`);
    }

    const topics = await this.getValidatedTopics(updateSetDto.topicIds);
    const existingCardIds = new Set(set.cards.map((card) => card.id));
    const incomingCardIds = updateSetDto.cards
      .map((card) => card.id)
      .filter((cardId): cardId is string => Boolean(cardId));

    const invalidCardIds = incomingCardIds.filter(
      (cardId) => !existingCardIds.has(cardId),
    );

    if (invalidCardIds.length) {
      throw new BadRequestException(
        `Cards do not belong to set "${setId}": ${invalidCardIds.join(', ')}`,
      );
    }

    return this.entityManager.transaction(async (manager) => {
      const cardIdsToDelete = set.cards
        .filter((card) => !incomingCardIds.includes(card.id))
        .map((card) => card.id);

      if (cardIdsToDelete.length) {
        await manager.delete(CardEntity, cardIdsToDelete);
      }

      const updatedSet = manager.create(SetEntity, {
        id: set.id,
        name: updateSetDto.name,
        description: updateSetDto.description,
        topics,
        user: set.user,
      });

      await manager.save(SetEntity, updatedSet);

      const cardsToSave = this.mapCards(updateSetDto.cards, setId);

      if (cardsToSave.length) {
        await manager.save(CardEntity, cardsToSave);
      }

      return manager.findOne(SetEntity, {
        where: { id: setId },
        relations: {
          cards: true,
        },
      });
    });
  }

  async deleteSet(userId: string, setId: string) {
    const set = await this.setRepository.findOne({
      where: {
        id: setId,
        user: { id: userId },
      },
    });

    if (!set) {
      throw new NotFoundException(`Set "${setId}" not found`);
    }

    await this.setRepository.remove(set);

    return { success: true };
  }

  getTopics() {
    return this.topicRepository.find();
  }

  private async getValidatedTopics(topicIds: string[]) {
    const topics = await this.topicRepository.findByIds(topicIds);

    if (topics.length !== topicIds.length) {
      const existingTopicIds = new Set(topics.map((topic) => topic.id));
      const missingTopicIds = topicIds.filter(
        (topicId) => !existingTopicIds.has(topicId),
      );

      throw new NotFoundException(
        `Topics not found: ${missingTopicIds.join(', ')}`,
      );
    }

    return topics.filter(
      (topic, index, allTopics) =>
        index ===
        allTopics.findIndex((currentTopic) => currentTopic.id === topic.id),
    );
  }

  private mapCards(
    cards: Array<CreateCardDto | UpdateCardDto>,
    setId?: string,
  ): DeepPartial<CardEntity>[] {
    return cards.map((card) => {
      const mappedCard: DeepPartial<CardEntity> = {
        id: ('id' in card && card.id) || undefined,
        position: card.position,
        term: card.term,
        termDescription: card.termDescription,
        termImage: card.termImageId
          ? ({ id: card.termImageId } as DeepPartial<CardEntity['termImage']>)
          : (null as unknown as DeepPartial<CardEntity['termImage']>),
        definition: card.definition,
        definitionImage: card.definitionImageId
          ? ({
              id: card.definitionImageId,
            } as DeepPartial<CardEntity['definitionImage']>)
          : (null as unknown as DeepPartial<CardEntity['definitionImage']>),
        textColor: card.textColor ?? undefined,
        backgroundColor: card.backgroundColor ?? undefined,
        set: setId ? ({ id: setId } as SetEntity) : undefined,
      };

      return mappedCard;
    });
  }
}
