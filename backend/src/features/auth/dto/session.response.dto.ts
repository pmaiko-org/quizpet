import { DeviceEntity } from "../session/entities/device.entity";
import { SessionEntity } from "../session/entities/session.entity";

export class SessionResponseDto {
  id: string;
  device: string;
  ipAddress: string;
  createdAt: Date;
  lastActivityAt: Date;
  expiresAt: Date;
  current: boolean;

  constructor(session: SessionEntity, currentSessionId: string) {
    this.id = session.id;
    this.device = SessionResponseDto.deviceName(session.device);
    this.ipAddress = session.ipAddress;
    this.createdAt = session.createdAt;
    this.lastActivityAt = session.lastActivityAt;
    this.expiresAt = session.expiresAt;
    this.current = session.id === currentSessionId;
  }

  private static deviceName(device: DeviceEntity) {
    const userAgent = device.userAgent?.trim();
    return userAgent ? userAgent.slice(0, 160) : "Unknown device";
  }
}
