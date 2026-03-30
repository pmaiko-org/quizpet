import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Set } from '../sets/set.entity';
import { StorageFile } from '../storage/storage.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  googleId: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToOne(() => StorageFile, { nullable: true, cascade: true, eager: true })
  @JoinColumn({ name: 'pictureId' })
  picture?: StorageFile;

  @OneToMany(() => Set, (set) => set.user)
  sets: Set[];
}
