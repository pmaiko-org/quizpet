import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import { after, before, describe, it } from "node:test";

import { closeCmsCache, getCmsRedirects } from "../server/utils/cms-cache";

const redirects = [{ from: "/old", to: "/new", statusCode: 301 }];

let server: Server;
let requests = 0;
let config: { cmsInternalUrl: string; redisUrl: string };

before(async () => {
  server = createServer((_request, response) => {
    requests += 1;
    response.setHeader("content-type", "application/json");
    response.end(JSON.stringify(redirects));
  });

  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));

  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;

  config = {
    cmsInternalUrl: `http://127.0.0.1:${port}`,
    redisUrl: "redis://127.0.0.1:1",
  };
});

after(async () => {
  closeCmsCache();
  await new Promise<void>(resolve => server.close(() => resolve()));
});

describe("CMS cache without Redis", () => {
  it("serves CMS content when Redis is unreachable", async () => {
    assert.deepEqual(await getCmsRedirects(config), redirects);
  });

  it("keeps serving from memory instead of refetching Strapi", async () => {
    const before = requests;

    assert.deepEqual(await getCmsRedirects(config), redirects);
    assert.equal(requests, before);
  });
});
