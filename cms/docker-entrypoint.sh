#!/bin/sh
set -eu

RCLONE_CONFIG_FILE="${RCLONE_CONFIG_FILE:-/root/.config/rclone/rclone.conf}"
RCLONE_REMOTE="${RCLONE_CMS_REMOTE:-gdrive:cms}"
MOUNT_POINT="${RCLONE_MOUNT_POINT:-/opt/app/public/uploads}"
VFS_CACHE_MODE="${RCLONE_CMS_VFS_CACHE_MODE:-off}"
MOUNT_TIMEOUT="${RCLONE_MOUNT_TIMEOUT:-60}"
WATCHDOG_INTERVAL="${RCLONE_WATCHDOG_INTERVAL:-15}"
APP_USER="${APP_USER:-node}"
APP_HOME="$(awk -F: -v user="${APP_USER:-node}" '$1 == user { print $6 }' /etc/passwd)"
APP_HOME="${APP_HOME:-/home/${APP_USER:-node}}"

log() {
  echo "[entrypoint] $*" >&2
}

is_mounted() {
  grep -q " ${MOUNT_POINT} fuse" /proc/mounts
}

if [ ! -f "$RCLONE_CONFIG_FILE" ]; then
  log "rclone config not found at ${RCLONE_CONFIG_FILE}, run 'make rclone-auth' first"
  exit 1
fi

mkdir -p "$MOUNT_POINT"

if [ -n "$(find "$MOUNT_POINT" -mindepth 1 -not -name .gitkeep -print -quit)" ]; then
  ORPHAN_DIR="/var/lib/rclone-orphaned/$(date +%Y-%m-%d_%H-%M-%S)"
  log "${MOUNT_POINT} is not empty before mounting, these files were written outside the remote"
  log "moving them to ${ORPHAN_DIR}"
  mkdir -p "$ORPHAN_DIR"
  find "$MOUNT_POINT" -mindepth 1 -maxdepth 1 -not -name .gitkeep -exec mv {} "$ORPHAN_DIR/" \;
fi

mount_remote() {
  rclone mount "$RCLONE_REMOTE" "$MOUNT_POINT" \
    --config "$RCLONE_CONFIG_FILE" \
    --allow-other \
    --vfs-cache-mode "$VFS_CACHE_MODE" \
    --uid "$(id -u "$APP_USER")" \
    --gid "$(id -g "$APP_USER")" \
    --dir-perms 0775 \
    --file-perms 0664 \
    --log-level INFO \
    "$@" &
  RCLONE_PID=$!
}

if [ -e "$MOUNT_POINT/.gitkeep" ]; then
  mount_remote --allow-non-empty
else
  mount_remote
fi

WAITED=0
while ! is_mounted; do
  if ! kill -0 "$RCLONE_PID" 2>/dev/null; then
    log "rclone exited before ${MOUNT_POINT} was mounted"
    exit 1
  fi

  if [ "$WAITED" -ge "$MOUNT_TIMEOUT" ]; then
    log "rclone did not mount ${MOUNT_POINT} within ${MOUNT_TIMEOUT}s"
    exit 1
  fi

  WAITED=$((WAITED + 1))
  sleep 1
done

log "${RCLONE_REMOTE} mounted at ${MOUNT_POINT} (vfs-cache-mode=${VFS_CACHE_MODE})"

(
  while is_mounted && kill -0 "$RCLONE_PID" 2>/dev/null; do
    sleep "$WATCHDOG_INTERVAL"
  done

  log "rclone mount at ${MOUNT_POINT} is gone, stopping the container"
  kill 1
) &

exec env HOME="$APP_HOME" su-exec "$APP_USER" "$@"
