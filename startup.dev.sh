#!/usr/bin/env bash
set -e
sleep 5
npm run migration:run
npm run seed:run
npm run start:prod
