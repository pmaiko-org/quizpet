import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, EntityManager, Repository } from "typeorm";
import { TopicEntity } from "./entity/topic.entity";
import { SetEntity } from "./entity/set.entity";
import { SetCreateDto } from "./dto/set/create.dto";
import { CardEntity } from "./entity/card.entity";
import { CardDetailsResponseDto } from "./dto/card/details.response.dto";
import { SetListItemResponseDto } from "./dto/set/list-item.response.dto";
import { SetUpdateDto } from "./dto/set/update.dto";
import { CardUpdateDto } from "./dto/card/update.dto";
import { SetDetailsResponseDto } from "./dto/set/details.response.dto";
import { CardCreateDto } from "./dto/card/create.dto";
import { TopicResponseDto } from "./dto/topic/response.dto";
import { SuccessResponseDto } from "../../common/dto/success.response.dto";
import { AbstractService } from "../../common/abstract.service";
import { SetListQueryDto } from "./dto/set/list.query.dto";
import { SetListResponseDto } from "./dto/set/list.response.dto";
import { EnglishLevelEntity } from "./entity/english-level.entity";
import { EnglishLevelResponseDto } from "./dto/english-level/response.dto";

@Injectable()
export class SetsService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(TopicEntity)
    private readonly topicRepository: Repository<TopicEntity>,
    @InjectRepository(EnglishLevelEntity)
    private readonly englishLevelRepository: Repository<EnglishLevelEntity>,
    @InjectRepository(SetEntity)
    private readonly setRepository: Repository<SetEntity>,
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
  ) {}

  async getCards(setId: string): Promise<CardDetailsResponseDto[]> {
    const cards = await this.cardRepository.find({
      where: { set: { id: setId } },
      order: { position: "ASC" },
    });

    return cards.map(card => new CardDetailsResponseDto(card));
  }

  async getSets(query: SetListQueryDto): Promise<SetListResponseDto> {
    return new AbstractService(
      this.setRepository,
      SetListItemResponseDto,
    ).paginate(query);
  }

  async getSet(setId: string) {
    const set = await this.setRepository.findOne({
      where: { id: setId },
      relations: {
        cards: true,
      },
      order: {
        cards: { position: "ASC" },
      },
    });
    if (set) return new SetDetailsResponseDto(set);
  }

  async createSet(userId: string, createSetDto: SetCreateDto) {
    const topics = await this.getValidatedTopics(createSetDto.topicIds);
    const englishLevel = await this.getValidatedEnglishLevel(
      createSetDto.englishLevelId,
    );
    const cards = this.mapCards(createSetDto.cards);

    const set = this.setRepository.create({
      name: createSetDto.name,
      description: createSetDto.description,
      topics,
      englishLevel,
      user: { id: userId },
      cards,
    });

    const savedSet = await this.setRepository.save(set);
    return this.getSet(savedSet.id);
  }

  async updateSet(userId: string, setId: string, updateSetDto: SetUpdateDto) {
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
    const englishLevel = await this.getValidatedEnglishLevel(
      updateSetDto.englishLevelId,
    );
    const existingCardIds = new Set(set.cards.map(card => card.id));
    const incomingCardIds = updateSetDto.cards
      .map(card => card.id)
      .filter((cardId): cardId is string => Boolean(cardId));

    const invalidCardIds = incomingCardIds.filter(
      cardId => !existingCardIds.has(cardId),
    );

    if (invalidCardIds.length) {
      throw new BadRequestException(
        `Cards do not belong to set "${setId}": ${invalidCardIds.join(", ")}`,
      );
    }

    return this.entityManager.transaction(async manager => {
      const cardIdsToDelete = set.cards
        .filter(card => !incomingCardIds.includes(card.id))
        .map(card => card.id);

      if (cardIdsToDelete.length) {
        await manager.delete(CardEntity, cardIdsToDelete);
      }

      const setToSave = manager.create(SetEntity, {
        id: set.id,
        name: updateSetDto.name,
        description: updateSetDto.description,
        topics,
        englishLevel,
        user: set.user,
      });

      await manager.save(SetEntity, setToSave);

      const cardsToSave = this.mapCards(updateSetDto.cards, setId);

      if (cardsToSave.length) {
        await manager.save(CardEntity, cardsToSave);
      }

      const updatedSet = await manager.findOne(SetEntity, {
        where: { id: setId },
        relations: {
          cards: true,
        },
        order: {
          cards: { position: "ASC" },
        },
      });

      return updatedSet ? new SetDetailsResponseDto(updatedSet) : undefined;
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

    return new SuccessResponseDto();
  }

  getTopics() {
    return this.topicRepository
      .find({ order: { position: "ASC" } })
      .then(topics => topics.map(topic => new TopicResponseDto(topic)));
  }

  getEnglishLevels() {
    return this.englishLevelRepository
      .find({ order: { position: "ASC" } })
      .then(englishLevels =>
        englishLevels.map(
          englishLevel => new EnglishLevelResponseDto(englishLevel),
        ),
      );
  }

  private async getValidatedTopics(topicIds: string[]) {
    const topics = await this.topicRepository.findByIds(topicIds);

    if (topics.length !== topicIds.length) {
      const existingTopicIds = new Set(topics.map(topic => topic.id));
      const missingTopicIds = topicIds.filter(
        topicId => !existingTopicIds.has(topicId),
      );

      throw new NotFoundException(
        `Topics not found: ${missingTopicIds.join(", ")}`,
      );
    }

    return topics.filter(
      (topic, index, allTopics) =>
        index ===
        allTopics.findIndex(currentTopic => currentTopic.id === topic.id),
    );
  }

  private async getValidatedEnglishLevel(englishLevelId?: string | null) {
    if (!englishLevelId) {
      return null;
    }

    const englishLevel = await this.englishLevelRepository.findOneBy({
      id: englishLevelId,
    });

    if (!englishLevel) {
      throw new NotFoundException(
        `English level "${englishLevelId}" not found`,
      );
    }

    return englishLevel;
  }

  private mapCards(
    cards: Array<CardCreateDto | CardUpdateDto>,
    setId?: string,
  ): DeepPartial<CardEntity>[] {
    return cards.map(card => {
      const mappedCard: DeepPartial<CardEntity> = {
        id: ("id" in card && card.id) || undefined,
        position: card.position,
        term: card.term,
        termDescription:
          card.termDescription === undefined ? undefined : card.termDescription,
        termImage: card.termImageId
          ? ({ id: card.termImageId } as DeepPartial<CardEntity["termImage"]>)
          : (null as unknown as DeepPartial<CardEntity["termImage"]>),
        definition: card.definition,
        definitionImage: card.definitionImageId
          ? ({
              id: card.definitionImageId,
            } as DeepPartial<CardEntity["definitionImage"]>)
          : (null as unknown as DeepPartial<CardEntity["definitionImage"]>),
        textColor: card.textColor === undefined ? undefined : card.textColor,
        backgroundColor:
          card.backgroundColor === undefined ? undefined : card.backgroundColor,
        set: setId ? ({ id: setId } as SetEntity) : undefined,
      };

      return mappedCard;
    });
  }
}
