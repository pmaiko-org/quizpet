import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';

@Entity('storage_files')
export class StorageFileEntity extends AbstractEntity<StorageFileEntity> {
  @Column()
  name: string;

  @Column()
  mimetype: string;

  @Column({ type: 'int' })
  size: number;
}
