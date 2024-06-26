#!/bin/bash
set -e

export SENTRY_RELEASE=$(cat SENTRY_RELEASE)

echo "Running clickhouse-migrations"
clickhouse-migrations migrate

echo "Running Typeorm migrations"
typeorm-ts-node-commonjs migration:run -d packages/server/src/data-source.ts

# Web server runs first. All other process types are dependant on the web server container
if [[ "$1" = 'web' || -z "$1" ]]; then
	export LAUDSPEAKER_PROCESS_TYPE=WEB

	echo "Running setup_config.sh"
	bash ./scripts/setup_config.sh
fi

if [[ "$1" = 'queue' ]]; then
	export LAUDSPEAKER_PROCESS_TYPE=QUEUE
	unset SERVE_CLIENT_FROM_NEST
fi

if [[ "$1" = 'cron' ]]; then
	export LAUDSPEAKER_PROCESS_TYPE=CRON
	unset SERVE_CLIENT_FROM_NEST
fi

echo "Starting LaudSpeaker Process: $LAUDSPEAKER_PROCESS_TYPE"
node dist/src/main.js
