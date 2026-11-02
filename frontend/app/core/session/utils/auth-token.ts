type TAccessTokenPayload = {
  exp?: number;
  type?: string;
};

export const readAccessTokenPayload = (token: string) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replaceAll("-", "+").replaceAll("_", "/");
    const decoded = import.meta.client
      ? atob(normalized)
      : Buffer.from(normalized, "base64").toString("utf8");
    return JSON.parse(decoded) as TAccessTokenPayload;
  } catch {
    return null;
  }
};

export const isAccessTokenUsable = (
  token: string | null,
  nowSeconds = Date.now() / 1000,
) => {
  if (!token) return false;
  const payload = readAccessTokenPayload(token);
  return Boolean(
    payload?.type === "access" && payload.exp && payload.exp > nowSeconds + 5,
  );
};
