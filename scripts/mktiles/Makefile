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

.PHONY: mktiles2
mktiles2:	## compile mktiles2
	go build ./cmd/mktiles2/...
clean:: ## remove generated files that should not be committed
	rm -f mktiles2

mktiles2.md: mktiles2.mandoc	## generate mktiles2 markdown (mandoc is buggy :( )
	$(MANDOC) -W warning -T markdown < mktiles2.mandoc > mktiles2.md.new
	mv mktiles2.md.new mktiles2.md
clean::
	rm -f mktiles2.md.new

.PHONY: man
man:	## display s3sync man page on terminal
	groff -mandoc -Tascii mktiles2.mandoc |less

.PHONY: pdf
pdf:	## generate pdf man page
	groff -mandoc -Tps -P-pa4 -pdfmark mktiles2.mandoc | ps2pdf - - > mktiles2.pdf.new
	mv mktiles2.pdf.new mktiles2.pdf
clean::
	rm -f mktiles2.pdf.new mktiles2.pdf

.PHONY: html
html:	## generate html man page (in lieu of markdown for now)
	$(MANDOC) -W warning -T html < mktiles2.mandoc > mktiles2.html.new
	mv mktiles2.html.new mktiles2.html
clean::
	rm -f mktiles2.html.new

.PHONY: txt
txt:	## generate txt man page (because html doesn't auto render on github)
	groff -mandoc -Tascii mktiles2.mandoc > mktiles2.txt.new
	mv mktiles2.txt.new mktiles2.txt
