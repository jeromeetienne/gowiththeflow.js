# Makefile to make automatize simple tasks

test:
	node test/testSeq.js && node test/testPar.js && node test/testDestroy.js
	
minify:
	curl --data-urlencode "js_code@gowiththeflow.js" 	\
		-d "output_format=text&output_info=compiled_code&compilation_level=SIMPLE_OPTIMIZATIONS" \
		http://closure-compiler.appspot.com/compile	\
		>> gowiththeflow.min.js
	echo size minified + gzip is `gzip -c gowiththeflow.min.js | wc -c` byte

.PHONY: test