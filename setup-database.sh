#!/bin/bash

# Install PostgreSQL
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql -c "CREATE DATABASE promohive;"
sudo -u postgres psql -c "CREATE USER promohive_user WITH ENCRYPTED PASSWORD 'promohive_pass123';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE promohive TO promohive_user;"
sudo -u postgres psql -c "ALTER USER promohive_user CREATEDB;"

echo "Database setup completed!"
echo "Connection string: postgresql://promohive_user:promohive_pass123@localhost:5432/promohive"
