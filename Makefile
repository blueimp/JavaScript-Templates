.PHONY: js

js:
	node_modules/.bin/uglifyjs js/tmpl.js -c -m -o js/tmpl.min.js
