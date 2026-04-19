import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../common/abstract.entity";
import { UserEntity } from "../users/user.entity";

@Entity("storage_files")
export class StorageFileEntity extends AbstractEntity<StorageFileEntity> {
  @Column()
  name: string;

  @Column()
  mimetype: string;

  @Column({ type: "int" })
  size: number;

  @ManyToOne(() => UserEntity, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user: UserEntity;
}
