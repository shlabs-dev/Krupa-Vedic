#!/bin/sh
# First run: copy the bundled database into the persistent volume
[ -f /app/data/krupa.db ] || cp /app/seed.db /app/data/krupa.db
exec node server.js
