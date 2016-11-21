DOCKER_CONTAINER = $(shell docker-compose ps -q app)
HEROKU_APP ?= "mdws"
HEROKU_REGISTRY = "registry.heroku.com/$(HEROKU_APP)/web"

all: .env

.env:
	@cp .env.example .env

bash:
	@docker exec -u root -it $(DOCKER_CONTAINER) bash

deploy:
	@docker build -t $(HEROKU_APP)_heroku -f ./docker/Dockerfile.heroku .
	@docker tag $(HEROKU_APP)_heroku $(HEROKU_REGISTRY)
	@docker push $(HEROKU_REGISTRY)
	@echo "* Deploy finished"

.PHONY: all bash deploy
