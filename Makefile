.PHONY: all
all: audit lint test build

.PHONY: debug
debug:
	npm run dev

.PHONY: build
build: # NB - assumed this will only be used by the CI, where we should be building node rather than netlify
	npm run build-node

.PHONY: test
test:
	npm run test

.PHONY: lint
lint:
	npm run lint

.PHONY: audit
audit: ## nothing yet,  but could probably use npm audit?
	exit

.PHONY: component
component: ## nothing yet,  but could probably use cypress (these are BDD type tests in other repos)?
	exit
