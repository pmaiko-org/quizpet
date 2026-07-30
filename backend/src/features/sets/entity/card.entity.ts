import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { SetEntity } from "./set.entity";
import { StorageFileEntity } from "../../storage/storage-file.entity";
import { AbstractEntity } from "../../../common/abstract.entity";

@Entity("cards")
export class CardEntity extends AbstractEntity<CardEntity> {
  @Column({ type: "int" })
  position: number;

  @Column()
  term: string; // word or question

  @Column({ type: "text", nullable: true })
  termDescription?: string | null;

  @ManyToOne(() => StorageFileEntity, {
    nullable: true,
    eager: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "termImageId" })
  termImage?: StorageFileEntity;

  @Column()
  definition: string; // translation or answer

  @ManyToOne(() => StorageFileEntity, {
    nullable: true,
    eager: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "definitionImageId" })
  definitionImage?: StorageFileEntity;

  @Column({ type: "varchar", nullable: true })
  textColor?: string | null;

  @Column({ type: "varchar", nullable: true })
  backgroundColor?: string | null;

  @ManyToOne(() => SetEntity, set => set.cards, { onDelete: "CASCADE" })
  @JoinColumn({ name: "setId" })
  set: SetEntity;
}
