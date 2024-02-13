#!/bin/bash

cd /app

until nc -vz $MYSQL_HOST 3306; do
  echo >&2 'MySQL is unavailable - sleeping.'
  sleep 1
done

printf "\n===\nSetting up logs folder...\n===\n"
mkdir -p logs

printf "\n===\nRunning the database migrations...\n===\n"
npm run migrate

printf "\n===\nSeeding the database...\n===\n"
npm run seed

if [ "$NODE_ENV" = "development" ] || [ "$NODE_ENV" = "test" ]; then
  printf "\n===\nRunning the test database migrations...\n===\n"
  NODE_ENV=test npm run migrate

  printf "\n===\nSeeding the test database...\n===\n"
  NODE_ENV=test npm run seed

  npm run start:development
else
  npm run start:production
fi
