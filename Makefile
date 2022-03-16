.PHONY: all
all: audit lint test build

.PHONY: debug
debug:
	npm run dev

.PHONY: build
build:
	npm run build

.PHONY: test
test:
	npm run test

.PHONY: lint
lint:
	npm run lint

.PHONY: audit
audit: ## nothing yet,  but could probably use npm audit?
	exit
