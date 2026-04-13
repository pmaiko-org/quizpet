sudo chown -R petya:petya /home/petya/projects/quizpet/
rclone authorize drive <client_id> <client_secret>
du -sh /root/.cache/rclone



```bash
docker compose exec -T backend sh -lc 'cat /storage/db-backups/db-backup-2026-04-13_11-37-06.sql' > ./backup.sql && docker compose stop backend && docker compose exec db sh -lc 'PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '\''$POSTGRES_DB'\'' AND pid <> pg_backend_pid();"' && docker compose exec db sh -lc 'PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -d postgres -c "DROP DATABASE IF EXISTS \"$POSTGRES_DB\";"' && docker compose exec db sh -lc 'PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -d postgres -c "CREATE DATABASE \"$POSTGRES_DB\";"' && docker compose exec -T db sh -lc 'PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < ./backup.sql && docker compose start backend
```
