sudo chown -R petya:petya /home/petya/projects/quizpet/
rclone authorize drive <client_id> <client_secret>
du -sh /root/.cache/rclone



```bash
docker compose exec -T backend sh -lc 'cat /storage/db-backups/db-backup-2026-04-13_11-37-06.sql' > ./backup.sql && docker compose stop backend && docker compose exec db sh -lc 'PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '\''$POSTGRES_DB'\'' AND pid <> pg_backend_pid();"' && docker compose exec db sh -lc 'PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -d postgres -c "DROP DATABASE IF EXISTS \"$POSTGRES_DB\";"' && docker compose exec db sh -lc 'PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -d postgres -c "CREATE DATABASE \"$POSTGRES_DB\";"' && docker compose exec -T db sh -lc 'PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < ./backup.sql && docker compose start backend
```


ps aux | grep "nuxt build"
kill 632955 641952
kill -9 632955 641952

## Strapi CMS

Strapi runs as the `cms` service and is available through the frontend proxy at `http://localhost:4999/cms/admin`.

Before the first start, copy the CMS variables from `.env.example` to `.env` and replace every placeholder with a random secret. Keep the same secret values between deployments; changing them invalidates existing Strapi sessions and API tokens.

On a cold start with an empty `db-data` volume, PostgreSQL creates the database configured by `CMS_DATABASE_NAME` through `initdb/01-create-databases.sh`. Initialization scripts do not run for an existing PostgreSQL volume, so create the CMS database manually before deploying this change to an existing environment. The production deploy command preserves `db-data` and `cms-uploads` volumes.

The daily database backup job writes separate `db-backup-*.sql` and `cms-backup-*.sql` files to `db-backups` and keeps the two newest files for each database. These SQL dumps do not include files from the `cms-uploads` volume.

Use `make down` to stop the stack without deleting data. `make reset` also deletes the PostgreSQL and upload volumes and must not be used in production.

Create and edit content types in development mode. The production admin panel intentionally does not expose the Content-Type Builder.
