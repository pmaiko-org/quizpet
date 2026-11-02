export const REFRESH_TOKEN_COOKIE = "qp_refresh";
export const DEVICE_COOKIE = "qp_device";
export const CSRF_COOKIE = "qp_csrf";
export const OAUTH_STATE_COOKIE = "qp_oauth_state";

export const ACCESS_TOKEN_TTL_SECONDS = 10 * 60;
export const REFRESH_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60;
export const SESSION_CACHE_TTL_SECONDS = ACCESS_TOKEN_TTL_SECONDS;
export const REFRESH_REUSE_GRACE_SECONDS = 5;
export const OAUTH_HANDOFF_TTL_SECONDS = 60;
