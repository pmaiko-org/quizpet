import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TopicEntity } from './entity/topic.entity';

const TOPIC_OPTIONS = [
  {
    label: 'Музика',
    value: 'music',
    icon: 'i-lucide-music-4',
    description:
      'Терміни, стилі, інструменти, жанри та все, що пов’язано з музикою.',
  },
  {
    label: 'Медицина',
    value: 'medicine',
    icon: 'i-lucide-stethoscope',
    description:
      'Анатомія, терміни, діагнози, препарати та інший медичний контент.',
  },
  {
    label: 'Книги',
    value: 'books',
    icon: 'i-lucide-book-open-text',
    description:
      'Автори, сюжети, персонажі, літературні терміни та читацькі добірки.',
  },
  {
    label: 'Спорт',
    value: 'sport',
    icon: 'i-lucide-trophy',
    description:
      'Види спорту, правила, інвентар, команди, тактики та спортивні терміни.',
  },
  {
    label: 'Мови',
    value: 'languages',
    icon: 'i-lucide-languages',
    description: 'Слова, переклади, фрази, граматика та мовні конструкції.',
  },
  {
    label: 'Наука',
    value: 'science',
    icon: 'i-lucide-flask-conical',
    description:
      'Формули, поняття, процеси, явища та матеріали з природничих наук.',
  },
  {
    label: 'Історія',
    value: 'history',
    icon: 'i-lucide-landmark',
    description: 'Дати, події, особистості, епохи та історичні поняття.',
  },
  {
    label: 'Інше',
    value: 'other',
    icon: 'i-lucide-shapes',
    description:
      'Універсальна тематика для наборів, які не входять в основні категорії.',
  },
] as const;

@Injectable()
export class TopicsSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(TopicEntity)
    private readonly topicsRepository: Repository<TopicEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    for (const topic of TOPIC_OPTIONS) {
      const exists = await this.topicsRepository.findOne({
        where: { value: topic.value },
      });

      if (!exists) {
        await this.topicsRepository.save(this.topicsRepository.create(topic));
      }
    }
  }
}
