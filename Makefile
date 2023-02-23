.PHONY: all
all: audit lint test build

.PHONY: debug
debug:
	npm run dev

.PHONY: build
build: # generic build command using automatic sveltekit adapter
	npm run build

.PHONY: build-netlify
build-netlify:
	npm run build:netlify

.PHONY: build-ons
build-ons: # NB - assumed this will only be used by the CI, where we should be building node rather than netlify
	npm run build:ons

.PHONY: test
test:
	npm run test

.PHONY: lint #ToDo fix this - lots of linting issues! should do npm run lint:prettier and npm run line:eslint
lint:
	exit

.PHONY: audit
audit: ## nothing yet,  but could probably use npm audit?
	exit

.PHONY: component
component:
	npm run e2e

.PHONY: component-ci
component: ## NB - assumed this will only be used by the CI
	npm run e2e:ci
