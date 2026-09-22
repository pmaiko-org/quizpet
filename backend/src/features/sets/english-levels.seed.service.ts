import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EnglishLevelEntity } from "./entity/english-level.entity";

const ENGLISH_LEVEL_OPTIONS = [
  {
    label: "A1 — Beginner",
    value: "a1",
    description: "Базові слова та прості фрази для повсякденних ситуацій.",
  },
  {
    label: "A2 — Elementary",
    value: "a2",
    description: "Поширені вислови та нескладне спілкування на знайомі теми.",
  },
  {
    label: "B1 — Intermediate",
    value: "b1",
    description: "Впевнене спілкування у більшості повсякденних ситуацій.",
  },
  {
    label: "B2 — Upper-Intermediate",
    value: "b2",
    description: "Складніші тексти та вільне спілкування з носіями мови.",
  },
  {
    label: "C1 — Advanced",
    value: "c1",
    description: "Гнучке й ефективне використання мови у складних контекстах.",
  },
  {
    label: "C2 — Proficiency",
    value: "c2",
    description: "Практично вільне розуміння та точне висловлення думок.",
  },
] as const;

@Injectable()
export class EnglishLevelsSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(EnglishLevelEntity)
    private readonly englishLevelsRepository: Repository<EnglishLevelEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    for (const [position, englishLevel] of ENGLISH_LEVEL_OPTIONS.entries()) {
      const existingEnglishLevel = await this.englishLevelsRepository.findOne({
        where: { value: englishLevel.value },
      });

      await this.englishLevelsRepository.save(
        this.englishLevelsRepository.create({
          ...existingEnglishLevel,
          ...englishLevel,
          position,
        }),
      );
    }
  }
}
