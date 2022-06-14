# Bitbloq Space

Repository for the bitbloq platform code

## Setup development environment

You need to clone public [bitbloq](https://github.com/bitbloq/bitbloq) repository at the same level as bitbloq-space

You need to have docker and docker-compose installed.

Then run

    docker-compose up

If you want to only see logs for an specific container, you can run docker-compose in detached mode and then use `docker-compose logs -f {service-name}` to see the logs for that particular service. For example:

    docker-compose up -d
    docker-compose logs -f frontend

The application will be accessible at:

    http://localhost:8000

API is accessible at:

    http://localhost:8000/api

You can access API graphql ui at:

    http://localhost:8000/graphql

Mongodb instance is accesible on port 8001



