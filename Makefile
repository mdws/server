all: .env

.env:
	@cp .env.example .env

.PHONY: all
