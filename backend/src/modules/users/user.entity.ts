import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Set } from '../sets/set.entity';

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

  @Column({ nullable: true })
  picture: string;

  @OneToMany(() => Set, (set) => set.user)
  sets: Set[];
}
