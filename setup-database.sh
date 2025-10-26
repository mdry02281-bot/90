#!/bin/bash

# Install PostgreSQL
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Generate secure password
DB_PASSWORD=$(openssl rand -base64 32 | tr -d '+/=' | head -c 24)

# Create database and user
sudo -u postgres psql -c "CREATE DATABASE promohive;"
sudo -u postgres psql -c "CREATE USER promohive_user WITH ENCRYPTED PASSWORD '$DB_PASSWORD';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE promohive TO promohive_user;"
sudo -u postgres psql -c "ALTER USER promohive_user CREATEDB;"

# Limit connections from localhost only
sudo -u postgres psql -d promohive -c "ALTER USER promohive_user WITH CONNECTION LIMIT 10;"

echo "Database setup completed!"
echo ""
echo "⚠️ SAVE THIS PASSWORD SECURELY:"
echo "Password: $DB_PASSWORD"
echo ""
echo "Connection string:"
echo "postgresql://promohive_user:$DB_PASSWORD@localhost:5432/promohive"
