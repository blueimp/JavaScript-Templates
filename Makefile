.PHONY: js

js:
	uglifyjs -nc tmpl.js > tmpl.min.js
