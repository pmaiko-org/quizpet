import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../common/abstract.entity";

@Entity("topics")
export class TopicEntity extends AbstractEntity<TopicEntity> {
  @Column()
  label: string;

  @Column({ unique: true })
  value: string;

  @Column()
  icon: string;

  @Column({ type: "text" })
  description: string;
}
