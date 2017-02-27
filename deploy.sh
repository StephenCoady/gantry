#!/bin/bash

ssh -i "$1" "$2" 'docker stop staging-application && \
docker rm staging-application && \
docker rmi scoady2/lifecycle-management-for-docker && \
docker run -d -p 3000:3000 --name staging-application -v /var/run/docker.sock:/var/run/docker.sock scoady2/lifecycle-management-for-docker'
