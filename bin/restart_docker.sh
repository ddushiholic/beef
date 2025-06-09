#!/bin/bash                                                                                                                                                

docker-compose -p finebeef exec finebeef_django python manage.py collectstatic
docker-compose -p finebeef down
docker-compose -p finebeef up -d
