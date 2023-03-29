# stolen from https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help
help: ## This help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-z0-9A-Z_.-]+:.*?## / {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# the input CSV
# The second line of this file is the header line.
# The first line is explanatory text.
CSV=data.csv


head.pipe: $(CSV)	## generate pipe-delimited headings-only file
	csv2pipe < "$(CSV)" | sed -n '2{p;q}' > $@.new
	mv $@.new $@
clean::
	rm -f head.pipe.new head.pipe


body.pipe: $(CSV)	## generate pipe-delimited data-only file (for awk input)
	csv2pipe < "$(CSV)" | sed 1,2d > $@.new
	mv $@.new $@
clean::
	rm -f body.pipe.new body.pipe


content.pipe: $(CSV)	## generate pipe-delimited version of data.csv
	csv2pipe < "$(CSV)"| sed 1d > $@.new
	mv $@.new $@
clean::
	rm -f content.pipe.new content.pipe


content.csv: $(CSV)	## generate CSV without first explanation line
	sed 1d < "$(CSV)" > $@.new
	mv $@.new $@
clean::
	rm -f content.csv.new content.csv


.PHONY: categories
categories: body.pipe	## print unique categories in CSV
	awk -F'|' '{printf "[%s]\n", $$5}' < body.pipe | sort | uniq


.PHONY: indicators
indicators: body.pipe	## print unique indicators in CSV
	awk -F'|' '{printf "[%s]\n", $$4}' < body.pipe | sort | uniq


.PHONY: ESS2
ESS2: content.csv taxonomy.json	## generate ESS2 from CSV and taxonomy.json
	mkess \
		-O ESS2 \
		-u https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/ESS2 \
		-t taxonomy.json \
		< content.csv
	breaks -I ESS2/tiles -O ESS2/breaksCkmeans
clean::
	rm -rf ESS2


.PHONY: dryrun
dryrun:	## dryrun push ESS2 to S3
	aws-sso exec \
		--account=337289154253 \
		--role=AdministratorAccess \
		-- s3sync \
		-n \
		ESS2 \
		s3://ons-dp-sandbox-atlas-data/ESS2

.PHONY: push
push:	## push ESS2 to S3
	aws-sso exec \
		--account=337289154253 \
		--role=AdministratorAccess \
		-- \
		s3sync \
		ESS2 \
		s3://ons-dp-sandbox-atlas-data/ESS2

# install ess_content.json
.PHONY: install
install:	## make ess_content.json usable for local node
	cp ESS2/ess_content.json ../../../src/data/staticContentJsons/

