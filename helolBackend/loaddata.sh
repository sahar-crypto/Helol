#!/bin/bash
set -e

echo "Loading initial dummy data..."
python3 helolBackend/manage.py loaddata neighborhoods
python3 helolBackend/manage.py loaddata governmental_authorities
python3 helolBackend/manage.py loaddata services
python3 helolBackend/manage.py loaddata superusers
python3 helolBackend/manage.py loaddata users
python3 helolBackend/manage.py loaddata complaintsessions
python3 helolBackend/manage.py loaddata chatmessages
python3 helolBackend/manage.py loaddata complaints
python3 helolBackend/manage.py loaddata news



echo "Starting Django server..."
exec "$@"
