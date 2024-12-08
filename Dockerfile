FROM postgres

# Environment variables required for PostgreSQL
ENV POSTGRES_USER=postgres
ENV POSTGRES_DB=postgres
# TODO: Use a secret for this
ENV POSTGRES_PASSWORD=postgres

COPY ./db/schema.sql /docker-entrypoint-initdb.d/01-schema.sql
COPY ./db/seed.sql /docker-entrypoint-initdb.d/02-seed.sql

