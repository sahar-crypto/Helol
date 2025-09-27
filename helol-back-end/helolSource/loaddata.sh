#!/bin/bash
set -e

echo "Loading initial dummy data..."
python3 manage.py loaddata neighborhoods
python3 manage.py loaddata governmental_authorities
python3 manage.py loaddata services
python3 manage.py loaddata superusers
python3 manage.py loaddata users
python3 manage.py loaddata complaintsessions
python3 manage.py loaddata chatmessages
python3 manage.py loaddata complaints


echo "Starting Django server..."
exec "$@"
