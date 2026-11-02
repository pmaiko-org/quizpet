import { Column, Entity, Index, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "../../../../common/abstract.entity";
import { UserEntity } from "../../../users/user.entity";
import { DeviceEntity } from "./device.entity";
import { RefreshTokenEntity } from "./refresh-token.entity";
import { SessionHistoryEntity } from "./session-history.entity";

@Entity("auth_sessions")
@Index(["user", "revokedAt", "expiresAt"])
export class SessionEntity extends AbstractEntity<SessionEntity> {
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  user: UserEntity;

  @ManyToOne(() => DeviceEntity, device => device.sessions, {
    onDelete: "CASCADE",
  })
  device: DeviceEntity;

  @Column({ type: "text", nullable: true })
  userAgent: string | null;

  @Column({ type: "varchar", length: 64 })
  ipAddress: string;

  @Column({ type: "timestamptz" })
  lastActivityAt: Date;

  @Column({ type: "timestamptz" })
  expiresAt: Date;

  @Column({ type: "timestamptz", nullable: true })
  revokedAt: Date | null;

  @Column({ type: "varchar", length: 64, nullable: true })
  revokeReason: string | null;

  @Column({ type: "varchar", length: 64 })
  currentRefreshTokenHash: string;

  @OneToMany(() => RefreshTokenEntity, token => token.session)
  refreshTokens: RefreshTokenEntity[];

  @OneToMany(() => SessionHistoryEntity, history => history.session)
  history: SessionHistoryEntity[];
}
