FROM node:6.7
MAINTAINER Nikolas Silva <nikolas.rsilva@gmail.com>

ARG APP_USER=app
ARG APP_DIR=/opt/app/

RUN useradd --user-group --create-home --home-dir /var/$APP_USER --shell /bin/false $APP_USER \
  ; npm install -g yarn

COPY package.json yarn.lock $APP_DIR
RUN chown -R $APP_USER:$APP_USER $APP_DIR

USER $APP_USER
WORKDIR $APP_DIR
RUN yarn

ENTRYPOINT ["npm"]
CMD ["run", "start:dev"]
