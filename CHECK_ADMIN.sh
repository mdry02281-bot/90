#!/bin/bash

echo "🔍 Checking Admin User in Database..."

sudo -u postgres psql -d promohive -c "SELECT username, email, role, \"isApproved\", \"isSuspended\" FROM \"User\";"

echo ""
echo "✅ Done!"
