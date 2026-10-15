import type { TCmsRedirect } from "../types";

export const MAX_REDIRECT_HOPS = 10;

export const followRedirects = (redirects: TCmsRedirect[], path: string) => {
  const visited = new Set<string>([path]);
  let current = path;
  let statusCode: TCmsRedirect["statusCode"] | undefined;

  for (let hop = 0; hop < MAX_REDIRECT_HOPS; hop += 1) {
    const match = redirects.find(item => item.from === current);

    if (!match || visited.has(match.to)) {
      break;
    }

    statusCode ??= match.statusCode;
    visited.add(match.to);
    current = match.to;
  }

  return current === path || !statusCode ? null : { to: current, statusCode };
};
