import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../common/abstract.entity";

@Entity("english_levels")
export class EnglishLevelEntity extends AbstractEntity<EnglishLevelEntity> {
  @Column()
  label: string;

  @Column({ unique: true })
  value: string;

  @Column({ type: "text" })
  description: string;

  @Column({ default: 0 })
  position: number;
}
