import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { UserEntity } from '../../users/user.entity';
import { CardEntity } from '../../cards/card.entity';
import { TopicEntity } from './topic.entity';
import { AbstractEntity } from '../../../common/abstract.entity';

@Entity('sets')
export class SetEntity extends AbstractEntity<SetEntity> {
  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => TopicEntity, { eager: true })
  @JoinTable({
    name: 'sets_topics',
    joinColumn: { name: 'setId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'topicId', referencedColumnName: 'id' },
  })
  topics: TopicEntity[];

  @ManyToOne(() => UserEntity, (user) => user.sets, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @OneToMany(() => CardEntity, (card) => card.set, {
    cascade: true,
    eager: true,
  })
  cards: CardEntity[];
}
