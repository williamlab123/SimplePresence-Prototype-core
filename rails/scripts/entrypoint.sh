#! bin/bash

echo "MIGRATING DATABASE"
rails db:migrate

echo "RUNNING SEEDS"
rails db:seed

echo "REMOVING OTHER INSTANCE"
rm -rf tmp/pids/*

echo "RUNNING SERVER"
rails s -b 0.0.0.0 -p 3000 -e development