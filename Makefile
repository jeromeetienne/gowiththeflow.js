# Makefile to make automatize simple tasks

test:
	node test/testSeq.js && node test/testPar.js 

.PHONY: test