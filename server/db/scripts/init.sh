#!/usr/bin/env bash

set -e

echo "Creating database and database user"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE USER coolinar_user;
	CREATE DATABASE coolinar_db ENCODING UTF8;
	GRANT ALL PRIVILEGES ON DATABASE coolinar_db TO coolinar_user;
 
	ALTER USER coolinar_user WITH PASSWORD 'coolinar123';
	ALTER USER coolinar_user WITH SUPERUSER;
EOSQL

echo "Database and user created"
