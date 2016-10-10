FROM node:6.7-slim
MAINTAINER Nikolas Silva <nikolas.rsilva@gmail.com>

VOLUME ["/opt/app"]
WORKDIR /opt/app

ENTRYPOINT ["npm"]
CMD ["run", "serve:dev"]
