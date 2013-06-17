.PHONY: js

js:
	node_modules/.bin/uglifyjs tmpl.js -c -m -o tmpl.min.js
