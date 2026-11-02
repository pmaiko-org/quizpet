import { Column, Entity, Index, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../../../common/abstract.entity";
import { SessionEntity } from "./session.entity";

@Entity("auth_refresh_tokens")
@Index(["tokenHash"], { unique: true })
@Index(["session", "createdAt"])
export class RefreshTokenEntity extends AbstractEntity<RefreshTokenEntity> {
  @ManyToOne(() => SessionEntity, session => session.refreshTokens, {
    onDelete: "CASCADE",
  })
  session: SessionEntity;

  @Column({ length: 64 })
  tokenHash: string;

  @Column({ type: "timestamptz" })
  expiresAt: Date;

  @Column({ type: "timestamptz", nullable: true })
  usedAt: Date | null;

  @Column({ type: "timestamptz", nullable: true })
  revokedAt: Date | null;
}
