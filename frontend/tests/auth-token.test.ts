import assert from "node:assert/strict";
import test from "node:test";

import { isAccessTokenUsable } from "../app/core/session/utils/auth-token";

const token = (payload: object) => {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `header.${encoded}.signature`;
};

test("accepts a non-expired access token", () => {
  assert.equal(
    isAccessTokenUsable(token({ type: "access", exp: 1_100 }), 1_000),
    true,
  );
});

test("rejects expired, wrong-type, and malformed tokens", () => {
  assert.equal(
    isAccessTokenUsable(token({ type: "access", exp: 1_000 }), 1_000),
    false,
  );
  assert.equal(
    isAccessTokenUsable(token({ type: "refresh", exp: 1_100 }), 1_000),
    false,
  );
  assert.equal(isAccessTokenUsable("invalid", 1_000), false);
});
