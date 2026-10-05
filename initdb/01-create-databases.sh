#!/bin/sh
set -eu

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" --set=cms_database="$CMS_DATABASE_NAME" <<-'EOSQL'
	SELECT format('CREATE DATABASE %I', :'cms_database')
	WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = :'cms_database')\gexec
EOSQL
