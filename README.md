## Storage (Google Drive)

Both the backend and Strapi keep their files on Google Drive, mounted with rclone inside the containers:

| Service | Mount point | Remote (default) |
|---|---|---|
| `backend` | `/storage` | `RCLONE_STORAGE_REMOTE` — `gdrive:` |
| `cms` | `/opt/app/public/uploads` | `RCLONE_CMS_REMOTE` — `gdrive:cms` |

On the Drive side this gives one tree: user files in the root, Strapi media in `cms/`, database dumps in `db-backups/`.

Before the first start create `rclone/rclone.conf` with a remote named `gdrive`:

```bash
make rclone-auth
```

`make dev` and `make prod` refuse to start without that file. The entrypoints mount the remote before the
application starts, fail loudly instead of writing next to an unmounted directory, and stop the container when the
mount disappears, so a restart never leaves the app writing to the container filesystem.

Moving existing Strapi media from the old `cms-uploads` volume to Drive (one-off, before the first start of the new
`cms` image):

```bash
make cms-uploads-migrate
```

Useful while debugging:

```bash
sudo chown -R petya:petya /home/petya/projects/quizpet/
du -sh /root/.cache/rclone
```



```bash
docker compose exec -T backend sh -lc 'cat /storage/db-backups/db-backup-2026-04-13_11-37-06.sql' > ./backup.sql && docker compose stop backend && docker compose exec db sh -lc 'PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '\''$POSTGRES_DB'\'' AND pid <> pg_backend_pid();"' && docker compose exec db sh -lc 'PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -d postgres -c "DROP DATABASE IF EXISTS \"$POSTGRES_DB\";"' && docker compose exec db sh -lc 'PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -d postgres -c "CREATE DATABASE \"$POSTGRES_DB\";"' && docker compose exec -T db sh -lc 'PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < ./backup.sql && docker compose start backend
```


ps aux | grep "nuxt build"
kill 632955 641952
kill -9 632955 641952

## Strapi CMS

Strapi runs as the `cms` service and is available through the frontend proxy at `http://localhost:4999/cms/admin`.

Before the first start, copy the CMS variables from `.env.example` to `.env` and replace every placeholder with a random secret. Keep the same secret values between deployments; changing them invalidates existing Strapi sessions and API tokens.

On a cold start with an empty `db-data` volume, PostgreSQL creates the database configured by `CMS_DATABASE_NAME` through `initdb/01-create-databases.sh`. Initialization scripts do not run for an existing PostgreSQL volume, so create the CMS database manually before deploying this change to an existing environment. The production deploy command preserves the `db-data` volume.

The daily database backup job writes separate `db-backup-*.sql` and `cms-backup-*.sql` files to `db-backups` on Drive and keeps the two newest files for each database. These SQL dumps contain the databases only; Strapi media lives next to them in `cms/`.

Use `make down` to stop the stack without deleting data. `make reset` also deletes the PostgreSQL volume and must not be used in production; files on Drive are never touched by it.

Create and edit content types in development mode. The production admin panel intentionally does not expose the Content-Type Builder.


```jaml
    NUXT_PUBLIC_CMS_API_URL: ${NUXT_PUBLIC_CMS_API_URL:?NUXT_PUBLIC_CMS_API_URL is required}
    networks:
      shared_network:
        aliases:
          - "${PROJECT_PREFIX}-frontend"
      internal_network:
        aliases:
          - "${PROJECT_PREFIX}-frontend"
```

## Nginx

Nginx runs as its own `nginx` service and is the entry point of the stack on port 4999. Configs live in `nginx/`: `nginx.conf` for prod, `dev.nginx.conf` for dev, each with its own Dockerfile.

The external reverse proxy must point at `${PROJECT_PREFIX}-nginx:4999` on `shared_network`; the `frontend` container is internal only and serves Nitro on `${FRONTEND_PORT}`.

In prod the frontend copies `.output/public` into the shared `frontend-static` volume on every start, and nginx mounts it read-only to serve `/_nuxt/` and images.
