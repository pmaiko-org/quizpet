import { Entity, Column, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { SetEntity } from '../sets/entity/set.entity';
import { StorageFileEntity } from '../storage/storage-file.entity';
import { AbstractEntity } from '../../common/abstract.entity';

@Entity('users')
export class UserEntity extends AbstractEntity<UserEntity> {
  @Column({ unique: true })
  googleId: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToOne(() => StorageFileEntity, {
    nullable: true,
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'pictureId' })
  picture?: StorageFileEntity;

  @OneToMany(() => SetEntity, (set) => set.user)
  sets: SetEntity[];
}
