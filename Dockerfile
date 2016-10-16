FROM node:6.7
MAINTAINER Nikolas Silva <nikolas.rsilva@gmail.com>

ARG APP_USER=app
ARG APP_DIR=/opt/app/

RUN apt-key adv --keyserver pgp.mit.edu --recv D101F7899D41F3C3 \
  ; echo "deb http://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
  ; apt-get update && apt-get install -y yarn

RUN useradd --user-group --create-home --home-dir /var/$APP_USER --shell /bin/false $APP_USER

COPY package.json yarn.lock $APP_DIR
RUN chown -R $APP_USER:$APP_USER $APP_DIR

USER $APP_USER
WORKDIR $APP_DIR
RUN yarn

ENTRYPOINT ["npm"]
CMD ["run", "start:dev"]
