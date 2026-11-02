import { Column, Entity, Index, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "../../../../common/abstract.entity";
import { UserEntity } from "../../../users/user.entity";
import { SessionEntity } from "./session.entity";

@Entity("auth_devices")
@Index(["user", "identifierHash"], { unique: true })
export class DeviceEntity extends AbstractEntity<DeviceEntity> {
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  user: UserEntity;

  @Column({ length: 64 })
  identifierHash: string;

  @Column({ type: "text", nullable: true })
  userAgent: string | null;

  @Column({ type: "timestamptz" })
  lastSeenAt: Date;

  @OneToMany(() => SessionEntity, session => session.device)
  sessions: SessionEntity[];
}
