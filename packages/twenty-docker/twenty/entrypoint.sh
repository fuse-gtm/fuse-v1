#!/bin/sh
set -e

run_with_timeout() {
    timeout_seconds="$1"
    shift

    "$@" &
    command_pid="$!"

    (
        sleep "$timeout_seconds"
        if kill -0 "$command_pid" >/dev/null 2>&1; then
            echo "Command timed out after ${timeout_seconds}s" >&2
            kill "$command_pid" >/dev/null 2>&1 || true
            sleep 2
            if kill -0 "$command_pid" >/dev/null 2>&1; then
                kill -9 "$command_pid" >/dev/null 2>&1 || true
            fi
        fi
    ) &
    timeout_pid="$!"

    command_code=0
    wait "$command_pid" || command_code="$?"
    kill "$timeout_pid" >/dev/null 2>&1 || true
    wait "$timeout_pid" >/dev/null 2>&1 || true

    return "$command_code"
}

setup_and_migrate_db() {
    if [ "${DISABLE_DB_MIGRATIONS}" = "true" ]; then
        echo "Database setup and migrations are disabled, skipping..."
        return
    fi

    echo "Running database setup and migrations..."

    # Run setup and migration scripts
    has_schema=$(psql -tAc "SELECT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'core')" ${PG_DATABASE_URL})
    if [ "$has_schema" = "f" ]; then
        echo "Database appears to be empty, running migrations."
        NODE_OPTIONS="--max-old-space-size=1500" tsx ./scripts/setup-db.ts
        yarn database:migrate:prod
    fi

    yarn command:prod cache:flush
    yarn command:prod upgrade
    yarn command:prod cache:flush

    echo "Successfully migrated DB!"
}

register_background_jobs() {
    if [ "${DISABLE_CRON_JOBS_REGISTRATION}" = "true" ]; then
        echo "Cron job registration is disabled, skipping..."
        return
    fi

    cron_timeout_seconds="${CRON_REGISTRATION_TIMEOUT_SECONDS:-60}"
    echo "Registering background sync jobs..."
    if run_with_timeout "$cron_timeout_seconds" yarn command:prod cron:register:all; then
        echo "Successfully registered all background sync jobs!"
    else
        echo "Warning: Failed to register background jobs within ${cron_timeout_seconds}s, but continuing startup..."
    fi
}

setup_and_migrate_db
register_background_jobs

# Continue with the original Docker command
exec "$@"
