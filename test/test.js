/*
 * JavaScript Templates Test 2.3.0
 * https://github.com/blueimp/JavaScript-Templates
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*global beforeEach, afterEach, describe, it, expect, require */

(function (context, expect, tmpl) {
    'use strict';

    if (context.require === undefined) {
        // Override the template loading method:
        tmpl.load = function (id) {
            switch (id) {
            case 'template':
                return '{%=o.value%}';
            }
        };
    }

    var data;

    beforeEach(function () {
        // Initialize the sample data:
        data = {
            value: 'value',
            nullValue: null,
            falseValue: false,
            zeroValue: 0,
            special:  '<>&"\'\x00',
            list: [1, 2, 3, 4, 5],
            func: function () {
                return this.value;
            },
            deep: {
                value: 'value'
            }
        };
    });

    afterEach(function () {
        // Purge the template cache:
        tmpl.cache = {};
    });

    describe('Template loading', function () {

        it('String template', function () {
            expect(
                tmpl('{%=o.value%}', data),
                'value'
            );
        });

        it('Load template by id', function () {
            expect(
                tmpl('template', data),
                'value'
            );
        });

        it('Retun function when called without data parameter', function () {
            expect(
                tmpl('{%=o.value%}')(data),
                'value'
            );
        });

        it('Cache templates loaded by id', function () {
            tmpl('template');
            expect(
                tmpl.cache.template
            ).to.be.a('function');
        });

    });

    describe('Interpolation', function () {

        it('Escape HTML special characters with {%=o.prop%}', function () {
            expect(
                tmpl('{%=o.special%}', data),
                '&lt;&gt;&amp;&quot;&#39;'
            );
        });

        it('Allow HTML special characters with {%#o.prop%}', function () {
            expect(
                tmpl('{%#o.special%}', data),
                '<>&"\'\x00'
            );
        });

        it('Function call', function () {
            expect(
                tmpl('{%=o.func()%}', data),
                'value'
            );
        });

        it('Dot notation', function () {
            expect(
                tmpl('{%=o.deep.value%}', data),
                'value'
            );
        });

        it('Handle single quotes', function () {
            expect(
                tmpl('\'single quotes\'{%=": \'"%}', data),
                '\'single quotes\': \''
            );
        });

        it('Handle double quotes', function () {
            expect(
                tmpl('"double quotes"{%=": \\""%}', data),
                '"double quotes": &quot;'
            );
        });

        it('Handle backslashes', function () {
            expect(
                tmpl('\\backslashes\\{%=": \\\\"%}', data),
                '\\backslashes\\: \\'
            );
        });

        it('Print out escaped falsy values', function () {
            expect(
                tmpl(
                    '{%=o.undefinedValue%}{% print(o.undefinedValue); %}' +
                        '{%=o.nullValue%}{% print(o.nullValue); %}' +
                        '{%=o.falseValue%}{% print(o.falseValue); %}' +
                        '{%=o.zeroValue%}{% print(o.zeroValue); %}',
                    data
                )
            ).to.be(
                'undefinedundefinednullnullfalsefalse00'
            );
        });

        it('Print out unescaped falsy values', function () {
            expect(
                tmpl(
                    '{%#o.undefinedValue%}{% print(o.undefinedValue, true); %}' +
                        '{%#o.nullValue%}{% print(o.nullValue, true); %}' +
                        '{%#o.falseValue%}{% print(o.falseValue, true); %}' +
                        '{%#o.zeroValue%}{% print(o.zeroValue, true); %}',
                    data
                )
            ).to.be(
                'undefinedundefinednullnullfalsefalse00'
            );
        });

        it('Preserve whitespace', function () {
            expect(
                tmpl(
                    '\n\r\t{%=o.value%}  \n\r\t{%=o.value%}  ',
                    data
                )
            ).to.be(
                '\n\r\tvalue  \n\r\tvalue  '
            );
        });

    });

    describe('Evaluation', function () {

        it('Escape HTML special characters with print(data)', function () {
            expect(
                tmpl('{% print(o.special); %}', data),
                '&lt;&gt;&amp;&quot;&#39;'
            );
        });

        it('Allow HTML special characters with print(data, true)', function () {
            expect(
                tmpl('{% print(o.special, true); %}', data),
                '<>&"\'\x00'
            );
        });

        it('Include template', function () {
            expect(
                tmpl('{% include("template", {value: "value"}); %}', data),
                'value'
            );
        });

        it('If condition', function () {
            expect(
                tmpl('{% if (o.value) { %}true{% } else { %}false{% } %}', data),
                'true'
            );
        });

        it('Else condition', function () {
            expect(
                tmpl(
                    '{% if (o.undefinedValue) { %}false{% } else { %}true{% } %}',
                    data
                )
            ).to.be(
                'true'
            );
        });

        it('For loop', function () {
            expect(
                tmpl(
                    '{% for (var i=0; i<o.list.length; i++) { %}' +
                        '{%=o.list[i]%}{% } %}',
                    data
                )
            ).to.be(
                '12345'
            );
        });

        it('For loop print call', function () {
            expect(
                tmpl(
                    '{% for (var i=0; i<o.list.length; i++) {' +
                        'print(o.list[i]);} %}',
                    data
                )
            ).to.be(
                '12345'
            );
        });

        it('For loop include template', function () {
            expect(
                tmpl(
                    '{% for (var i=0; i<o.list.length; i++) {' +
                        'include("template", {value: o.list[i]});} %}',
                    data
                ).replace(/[\r\n]/g, '')
            ).to.be(
                '12345'
            );
        });

        it('Modulo operator', function () {
            expect(
                tmpl(
                    '{% if (o.list.length % 5 === 0) { %}5 list items{% } %}',
                    data
                ).replace(/[\r\n]/g, '')
            ).to.be(
                '5 list items'
            );
        });

    });

}(
    this,
    this.expect || require('expect.js'),
    this.tmpl || require('../js/tmpl').tmpl
));
