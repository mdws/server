FROM node:6.7
MAINTAINER Nikolas Silva <nikolas.rsilva@gmail.com>

ARG APP_USER=app
ARG APP_DIR=/opt/app/

# Add app user
RUN useradd --user-group --create-home --home-dir /var/$APP_USER --shell /bin/false $APP_USER

# Install yarn and ffmpeg
RUN echo 'deb http://ftp.us.debian.org/debian jessie-backports main' >> /etc/apt/sources.list \
  ; apt-get update -y && apt-get install -y ffmpeg \
  ; npm install -g yarn

# Copy dependency files
COPY package.json yarn.lock $APP_DIR
RUN chown -R $APP_USER:$APP_USER $APP_DIR

# Install dependencies
USER $APP_USER
WORKDIR $APP_DIR
RUN yarn

# Start app
ENTRYPOINT ["npm"]
CMD ["run", "start:dev"]
