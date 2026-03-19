import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Card } from '../cards/card.entity';

@Entity('sets')
export class Set {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.sets, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Card, (card) => card.set, { cascade: true })
  cards: Card[];

  @CreateDateColumn()
  createdAt: Date;
}
