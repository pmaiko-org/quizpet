import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SetEntity } from '../sets/entity/set.entity';
import { StorageFileEntity } from '../storage/storage-file.entity';
import { AbstractEntity } from '../../common/abstract.entity';

@Entity('cards')
export class CardEntity extends AbstractEntity<CardEntity> {
  @Column({ type: 'int' })
  position: number;

  @Column()
  term: string; // word or question

  @ManyToOne(() => StorageFileEntity, {
    nullable: true,
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'termImageId' })
  termImage?: StorageFileEntity;

  @Column()
  definition: string; // translation or answer

  @ManyToOne(() => StorageFileEntity, {
    nullable: true,
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'definitionImageId' })
  definitionImage?: StorageFileEntity;

  @Column({ nullable: true })
  textColor?: string;

  @Column({ nullable: true })
  backgroundColor?: string;

  @ManyToOne(() => SetEntity, (set) => set.cards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'setId' })
  set: SetEntity;
}
