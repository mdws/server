DOCKER_CONTAINER = $(shell docker-compose ps -q app)

all: .env

.env:
	@cp .env.example .env

bash:
	@docker exec -it $(DOCKER_CONTAINER) bash

.PHONY: all bash
