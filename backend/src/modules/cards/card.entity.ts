import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Set } from '../sets/set.entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  term: string; // word or question

  @Column()
  definition: string; // translation or answer

  @ManyToOne(() => Set, (set) => set.cards, { onDelete: 'CASCADE' })
  set: Set;
}
