#
# Makefile
#

# stolen from https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help
help: ## This help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-z0-9A-Z_.-]+:.*?## / {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# If you don't have mandoc installed locally, you can run a dockerised version at
# https://github.com/wavemechanics/docker-mandoc
MANDOC=mandoc

.PHONY: s3sync
s3sync:	## compile s3sync
	go build ./cmd/s3sync/...
clean::	## remove generated files that should not be committed
	rm -f s3sync

s3sync.md: s3sync.mandoc	## generate s3sync markdown
	$(MANDOC) -T markdown < s3sync.mandoc > s3sync.md.new
	mv s3sync.md.new s3sync.md
clean::
	rm -f s3sync.md.new

.PHONY: man
man:	## display s3sync man page on terminal
	$(MANDOC) < s3sync.mandoc | less

.PHONY: pdf
pdf:    ## generate pdf man page
	groff -mandoc -Tps -P-pa4 -pdfmark s3sync.mandoc | ps2pdf - - > s3sync.pdf.new
	mv s3sync.pdf.new s3sync.pdf
clean::
	rm -f s3sync.pdf.new s3sync.pdf
