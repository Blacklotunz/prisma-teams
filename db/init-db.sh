# Create the database tables defined in schema.sql
psql -d $DATABASE_URL -f schema.sql

# Seed the database with data from seed.sql
psql -d $DATABASE_URL -f seed.sql