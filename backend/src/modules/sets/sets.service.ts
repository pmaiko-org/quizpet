import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { TopicEntity } from './entity/topic.entity';
import { SetEntity } from './entity/set.entity';
import { CreateSetDto } from './dto/create-set.dto';
import { CardEntity } from '../cards/card.entity';
import { SetResponseDto } from './dto/set.response.dto';

@Injectable()
export class SetsService {
  constructor(
    @InjectRepository(TopicEntity)
    private readonly topicRepository: Repository<TopicEntity>,
    @InjectRepository(SetEntity)
    private readonly setRepository: Repository<SetEntity>,
  ) {}

  findByUser(data: any) {
    console.log(data);
    return '1';
  }

  async getSets() {
    const sets = await this.setRepository.find({
      relations: {
        cards: true,
      },
    });

    return sets.map((set) => new SetResponseDto(set));
  }

  async createSet(userId: string, createSetDto: CreateSetDto) {
    const topics = await this.topicRepository.findByIds(createSetDto.topicIds);

    if (topics.length !== createSetDto.topicIds.length) {
      const existingTopicIds = new Set(topics.map((topic) => topic.id));
      const missingTopicIds = createSetDto.topicIds.filter(
        (topicId) => !existingTopicIds.has(topicId),
      );

      throw new NotFoundException(
        `Topics not found: ${missingTopicIds.join(', ')}`,
      );
    }

    const uniqueTopics = topics.filter(
      (topic, index, allTopics) =>
        index ===
        allTopics.findIndex((currentTopic) => currentTopic.id === topic.id),
    );

    const cards: DeepPartial<CardEntity>[] = createSetDto.cards.map((card) => ({
      position: card.position,
      term: card.term,
      termImage: card.termImageId ? { id: card.termImageId } : undefined,
      definition: card.definition,
      definitionImage: card.definitionImageId
        ? { id: card.definitionImageId }
        : undefined,
      textColor: card.textColor,
      backgroundColor: card.backgroundColor,
    }));

    const set = this.setRepository.create({
      name: createSetDto.name,
      description: createSetDto.description,
      topics: uniqueTopics,
      user: { id: userId },
      cards,
    });

    return this.setRepository.save(set);
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
}
