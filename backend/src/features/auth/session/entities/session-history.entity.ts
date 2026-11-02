import { Column, Entity, Index, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../../../common/abstract.entity";
import { SessionEntity } from "./session.entity";

export enum SessionEventType {
  CREATED = "created",
  REFRESHED = "refreshed",
  LOGGED_OUT = "loggedOut",
  REVOKED = "revoked",
  REUSE_DETECTED = "reuseDetected",
}

@Entity("auth_session_history")
@Index(["session", "createdAt"])
export class SessionHistoryEntity extends AbstractEntity<SessionHistoryEntity> {
  @ManyToOne(() => SessionEntity, session => session.history, {
    onDelete: "CASCADE",
  })
  session: SessionEntity;

  @Column({ type: "enum", enum: SessionEventType })
  event: SessionEventType;

  @Column({ type: "varchar", length: 64 })
  ipAddress: string;

  @Column({ type: "text", nullable: true })
  userAgent: string | null;
}
