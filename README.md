# JavaScript Templates

## Demo
[JavaScript Templates Demo](http://blueimp.github.com/JavaScript-Templates/)

## Usage

### Client-side
Include the (minified) JavaScript Templates script in your HTML markup:

```html
<script src="tmpl.min.js"></script>
```

Add a script section with type **"text/html"** and your template definition as content:

```html
<script type="text/html" id="tmpl-demo">
<h3>{%=o.title%}</h3>
<p>Released under the
<a href="{%=o.license.url%}">{%=o.license.name%}</a>.</p>
<h4>Features</h4>
<ul>
{% for (var i=0; i<o.features.length; i++) { %}
    <li>{%=o.features[i]%}</li>
{% } %}
</ul>
</script>
```

**"o"** (the lowercase letter) is a reference to the data parameter of the template function (see the API section on how to modify this identifier).

In your application code, create a JavaScript object to use as data for the template:

```js
var data = {
    "title": "JavaScript Templates",
    "license": {
        "name": "MIT license",
        "url": "http://www.opensource.org/licenses/MIT"
    },
    "features": [
        "lightweight & fast",
        "powerful",
        "zero dependencies"
    ]
};
```

In a real application, this data could be the result of retrieving a [JSON](http://json.org/) resource.

Render the result by calling the **tmpl()** method with the id of the template and the data object as arguments:

```js
document.getElementById("result").innerHTML = tmpl("tmpl-demo", data);
```

### Server-side

The following is an example how to use the JavaScript Templates engine on the server-side with [node.js](http://nodejs.org/).

Create a new directory and add the **tmpl.js** file. Or alternatively, install the **blueimp-tmpl** package with [npm](http://npmjs.org/):

```sh
npm install blueimp-tmpl
```

Add a file **template.html** with the following content:

```html
<!DOCTYPE HTML>
<title>{%=o.title%}</title>
<h3><a href="{%=o.url%}">{%=o.title%}</a></h3>
<h4>Features</h4>
<ul>
{% for (var i=0; i<o.features.length; i++) { %}
    <li>{%=o.features[i]%}</li>
{% } %}
</ul>
```

Add a file **server.js** with the following content:

```js
require("http").createServer(function (req, res) {
    var fs = require("fs"),
        // The tmpl module exports the tmpl() function:
        tmpl = require("./tmpl").tmpl,
        // Use the following version if you installed the package with npm:
        // tmpl = require("blueimp-tmpl").tmpl,
        // Sample data:
        data = {
            "title": "JavaScript Templates",
            "url": "https://github.com/blueimp/JavaScript-Templates",
            "features": [
                "lightweight & fast",
                "powerful",
                "zero dependencies"
            ]
        };
    // Override the template loading method:
    tmpl.load = function (id) {
        var filename = id + ".html";
        console.log("Loading " + filename);
        return fs.readFileSync(filename, "utf8");
    };
    res.writeHead(200, {"Content-Type": "text/html"});
    // Render the content:
    res.end(tmpl("template", data));
}).listen(8080, "localhost");
console.log("Server running at http://localhost:8080/");
```

Run the application with the following command:

```sh
node server.js
```

## Requirements
The JavaScript Templates script has zero dependencies.

## API

### tmpl() function
The **tmpl()** function is added to the global **window** object and can be called as global function:

```js
var result = tmpl("tmpl-demo", data);
```

The **tmpl()** function can be called with the id of a template, or with a template string:

```js
var result = tmpl("<h3>{%=o.title%}</h3>", data);
```

If called without second argument, **tmpl()** returns a reusable template function:

```js
var func = tmpl("<h3>{%=o.title%}</h3>");
document.getElementById("result").innerHTML = func(data);
```

### Templates cache
Templates loaded by id are cached in the map **tmpl.cache**, which can be modified:

```js
var func = tmpl("tmpl-demo");
var cached = typeof tmpl.cache["tmpl-demo"] === "function"; // true

tmpl.cache["tmpl-demo"] = tmpl("<h3>{%=o.title%}</h3>");
var result = tmpl("tmpl-demo", {title: "JS"}); // Renders "<h3>JS</h3>"
```

### Output encoding
The method **tmpl.encode** is used to escape HTML special characters in template output:

```js
var output = tmpl.encode("<>&\"\x00"); // Renders "&lt;&gt;&amp;&quot;"
```

**tmpl.encode** makes use of the regular expression **tmpl.encReg** and the encoding map **tmpl.encMap** to match and replace special characters, which can be modified to change the behavior of the output encoding:

```js
// Add single quotes to the encoding rules:
tmpl.encReg = /[<>&"'\x00]/g;
tmpl.encMap["'"] = "&#39;";

var output = tmpl.encode("<>&\"'\x00"); // Renders "&lt;&gt;&amp;&quot;&#39;"
```

### Local helper variables
The local variables available inside the templates are the following:

* **o**: The data object given as parameter to the template function (see the next section on how to modify the parameter name).
* **_s**: The string for the rendered result content.
* **_t**: A reference to the **tmpl** function object.
* **_e**: A reference to the **tmpl.encode** method.
* **print**: Function to add content to the rendered result string.
* **include**: Function to include the return value of a different template in the result.

To introduce additional local helper variables, the string **tmpl.helper** can be extended. The following adds a convenience function for *console.log* and a streaming function, that streams the template rendering result back to the callback argument (note the comma at the beginning of each variable declaration):

```js
tmpl.helper += ",log=function(){console.log.apply(console, arguments)}" +
    ",st='',stream=function(cb){var l=st.length;st=_s;cb( _s.slice(l));}";
```

Those new helper functions could be used to stream the template contents to the console output:

```html
<script type="text/html" id="tmpl-demo">
<h3>{%=o.title%}</h3>
{% stream(log); %}
<p>Released under the
<a href="{%=o.license.url%}">{%=o.license.name%}</a>.</p>
{% stream(log); %}
<h4>Features</h4>
<ul>
{% stream(log); %}
{% for (var i=0; i<o.features.length; i++) { %}
    <li>{%=o.features[i]%}</li>
    {% stream(log); %}
{% } %}
</ul>
{% stream(log); %}
</script>
```

### Template function argument
The generated template functions accept one argument, which is the data object given to the **tmpl(id, data)** function. This argument is available inside the template definitions as parameter **o** (the lowercase letter).

The argument name can be modified by overriding **tmpl.arg**:

```js
tmpl.arg = "p";

// Renders "<h3>JavaScript Templates</h3>":
var result = tmpl("<h3>{%=p.title%}</h3>", {title: "JavaScript Templates"});
```

### Template parsing
The template contents are matched and replaced using the regular expression **tmpl.regexp** and the replacement function **tmpl.func**. The replacement function operates based on the [parenthesized submatch strings](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_function_as_a_parameter).

To use different tags for the template syntax, override **tmpl.regexp** with a modified regular expression, by exchanging all occurrences of "**\\{%**" and "**%\\}**", e.g. with "**\\[%**" and "**%\\]**":

```js
tmpl.regexp = /(\s+)|('|\\)(?![^%]*%\])|(?:\[%(=|#)(.+?)%\])|(\[%)|(%\])/g;
```

## Templates syntax

### Interpolation
Print variable with HTML special characters escaped:

```html
<h3>{%=o.title%}</h3>
```

Print variable without escaping:

```html
<h3>{%#o.user_id%}</h3>
```

Print output of function calls:

```html
<a href="{%=encodeURI(o.url)%}">Website</a>
```

Use dot notation to print nested properties:

```html
<strong>{%=o.author.name%}</strong>
```

Note that the JavaScript Templates engine prints **falsy** values as empty strings.  
That is, **undefined**, **null**, **false**, **0** and **NaN** will all be converted to **''**.  
To be able to print e.g. the number 0, convert it to a String before using it as an output variable:

```html
<h3>{%=0+''%}</h3>
```

### Evaluation
Use **print(str)** to add escaped content to the output:

```html
<span>Year: {% var d=new Date(); print(d.getFullYear()); %}</span>
```

Use **print(str, true)** to add unescaped content to the output:

```html
<span>{% print("Fast &amp; powerful", true); %}</span>
```

Use **include(str, obj)** to include content from a different template:

```html
<div>
{% include('tmpl-link', {name: "Website", url: "http://example.org"}); %}
</div>
```

If else condition:

```html
{% if (o.author.url) { %}
    <a href="{%=encodeURI(o.author.url)%}">{%=o.author.name%}</a>
{% } else { %}
    <em>No author url.</em>
{% } %}
```

For loop:

```html
<ul>
{% for (var i=0; i<o.features.length; i++) { %}
    <li>{%=o.features[i]%}</li>
{% } %}
</ul>
```

## License
The JavaScript Templates script is released under the [MIT license](http://www.opensource.org/licenses/MIT).
