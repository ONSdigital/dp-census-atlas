# stolen from https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help
help: ## This help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-z0-9A-Z_.-]+:.*?## / {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: ssh.cfg
ssh.cfg:        ## generate ssh.cfg for atlas and container hosts
	test -n "$${ATLAS_USER}"
	./gencfg.sh > ssh.cfg.new && mv ssh.cfg.new ssh.cfg

.PHONY: tunnel
tunnel: ## set up ssh tunnel to docker on Atlas host
	ssh -F ssh.cfg -L 2375:localhost:2375 atlas

.PHONY: image
image:	## build the atlas image
	test -n "$${ATLAS_USER}"
	docker build -t atlas-$${ATLAS_USER} -f Dockerfile .

.PHONY: up
up:	## start the atlas container
	test -n "$${ATLAS_USER}"
	docker compose up --detach
	./gencfg.sh > ssh.cfg.new
	mv ssh.cfg.new ssh.cfg

.PHONY: down
down:	## stop the atlas container
	test -n "$${ATLAS_USER}"
	docker compose down && \
	./gencfg.sh > ssh.cfg.new && \
	mv ssh.cfg.new ssh.cfg

.PHONY: ssh-atlas
ssh-atlas:	## ssh to the Atlas host
	ssh -F ssh.cfg atlas

.PHONY: ssh-container
ssh-container:	## ssh to the Atlas container
	ssh -F ssh.cfg container
