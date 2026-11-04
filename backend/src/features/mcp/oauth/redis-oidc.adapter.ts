import type {
  Adapter,
  AdapterConstructor,
  AdapterPayload,
} from "oidc-provider";
import type Redis from "ioredis";

const GRANTABLE_MODELS = new Set([
  "AccessToken",
  "AuthorizationCode",
  "RefreshToken",
  "DeviceCode",
  "BackchannelAuthenticationRequest",
]);

const CONSUMABLE_MODELS = new Set([
  "AuthorizationCode",
  "RefreshToken",
  "DeviceCode",
  "BackchannelAuthenticationRequest",
  "PushedAuthorizationRequest",
]);

export const createRedisOidcAdapter = (redis: Redis): AdapterConstructor =>
  class RedisOidcAdapter implements Adapter {
    constructor(private readonly name: string) {}

    async upsert(
      id: string,
      payload: AdapterPayload,
      expiresIn?: number,
    ): Promise<void> {
      const key = this.key(id);
      const multi = redis.multi();

      if (CONSUMABLE_MODELS.has(this.name)) {
        multi.hset(key, "payload", JSON.stringify(payload));
      } else {
        multi.set(key, JSON.stringify(payload));
      }

      if (expiresIn) multi.expire(key, expiresIn);

      if (
        GRANTABLE_MODELS.has(this.name) &&
        typeof payload.grantId === "string"
      ) {
        const grantKey = this.grantKey(payload.grantId);
        multi.rpush(grantKey, key);
        if (expiresIn) multi.expire(grantKey, expiresIn);
      }

      if (typeof payload.userCode === "string") {
        const userCodeKey = this.userCodeKey(payload.userCode);
        multi.set(userCodeKey, id);
        if (expiresIn) multi.expire(userCodeKey, expiresIn);
      }

      if (typeof payload.uid === "string") {
        const uidKey = this.uidKey(payload.uid);
        multi.set(uidKey, id);
        if (expiresIn) multi.expire(uidKey, expiresIn);
      }

      await multi.exec();
    }

    async find(id: string): Promise<AdapterPayload | undefined> {
      if (!id) return undefined;

      if (CONSUMABLE_MODELS.has(this.name)) {
        const data = await redis.hgetall(this.key(id));
        if (!data.payload) return undefined;
        return {
          ...JSON.parse(data.payload),
          ...(data.consumed ? { consumed: Number(data.consumed) } : {}),
        } as AdapterPayload;
      }

      const data = await redis.get(this.key(id));
      return data ? (JSON.parse(data) as AdapterPayload) : undefined;
    }

    async findByUserCode(
      userCode: string,
    ): Promise<AdapterPayload | undefined> {
      const id = await redis.get(this.userCodeKey(userCode));
      return id ? this.find(id) : undefined;
    }

    async findByUid(uid: string): Promise<AdapterPayload | undefined> {
      const id = await redis.get(this.uidKey(uid));
      return id ? this.find(id) : undefined;
    }

    async consume(id: string): Promise<void> {
      await redis.hset(this.key(id), "consumed", Math.floor(Date.now() / 1000));
    }

    async destroy(id: string): Promise<void> {
      await redis.del(this.key(id));
    }

    async revokeByGrantId(grantId: string): Promise<void> {
      const grantKey = this.grantKey(grantId);
      const keys = await redis.lrange(grantKey, 0, -1);
      if (keys.length) await redis.del(...keys);
      await redis.del(grantKey);
    }

    private key(id: string) {
      return `oauth:${this.name}:${id}`;
    }

    private grantKey(grantId: string) {
      return `oauth:grant:${grantId}`;
    }

    private userCodeKey(userCode: string) {
      return `oauth:user-code:${userCode}`;
    }

    private uidKey(uid: string) {
      return `oauth:uid:${uid}`;
    }
  };
