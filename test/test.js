/*
 * JavaScript Templates Test 1.0.1
 * https://github.com/blueimp/JavaScript-Templates
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://creativecommons.org/licenses/MIT/
 */

/*global require */

(function ($) {
    'use strict';

    var lifecycle = {
            setup: function () {},
            teardown: function () {
                // Purge the template cache:
                $.tmpl.cache = {};
            }
        },
        data = {
            value: 'value',
            special:  '<>&"\x00',
            list: [1, 2, 3, 4, 5],
            func: function () {
                return this.value;
            },
            deep: {
                value: 'value'
            }
        },
        nodeQunit = {
            setup: function () {},
            teardown: function () {}
        };

    if (!$.module) {
        // Node.js QUnit compatible Testrunner:
        nodeQunit = require('./node-qunit');
        $.module = nodeQunit.module;
        $.test = nodeQunit.test;
        $.strictEqual = nodeQunit.assert.strictEqual;
        $.tmpl = require('../tmpl').tmpl;
        // Override the template loading method:
        $.tmpl.load = function (id) {
            return require('fs').readFileSync('./test/' + id + '.html', 'utf8');
        };
    }

    nodeQunit.setup();

    $.module('Template loading', lifecycle);

    $.test('String template', function () {
        $.strictEqual(
            $.tmpl('{%=o.value%}', data),
            'value'
        );
    });

    $.test('Load template by id', function () {
        $.strictEqual(
            $.tmpl('template', data),
            'value'
        );
    });

    $.test('Retun function when called without data parameter', function () {
        $.strictEqual(
            $.tmpl('{%=o.value%}')(data),
            'value'
        );
    });

    $.test('Cache templates loaded by id', function () {
        $.tmpl('template');
        $.strictEqual(
            $.tmpl.cache.template(data),
            'value'
        );
    });

    $.module('Interpolation', lifecycle);

    $.test('Escape HTML special characters with {%=o.prop%}', function () {
        $.strictEqual(
            $.tmpl('{%=o.special%}', data),
            '&lt;&gt;&amp;&quot;'
        );
    });

    $.test('Allow HTML special characters with {%#o.prop%}', function () {
        $.strictEqual(
            $.tmpl('{%#o.special%}', data),
            '<>&"\x00'
        );
    });

    $.test('Function call', function () {
        $.strictEqual(
            $.tmpl('{%=o.func()%}', data),
            'value'
        );
    });

    $.test('Dot notation', function () {
        $.strictEqual(
            $.tmpl('{%=o.deep.value%}', data),
            'value'
        );
    });

    $.test('Handle single quotes', function () {
        $.strictEqual(
            $.tmpl('\'single quotes\'{%=": \'"%}', data),
            '\'single quotes\': \''
        );
    });

    $.test('Handle double quotes', function () {
        $.strictEqual(
            $.tmpl('"double quotes"{%=": \\""%}', data),
            '"double quotes": &quot;'
        );
    });

    $.test('Handle backslashes', function () {
        $.strictEqual(
            $.tmpl('\\backslashes\\{%=": \\\\"%}', data),
            '\\backslashes\\: \\'
        );
    });

    $.module('Evaluation', lifecycle);

    $.test('Escape HTML special characters with print(data)', function () {
        $.strictEqual(
            $.tmpl('{% print(o.special); %}', data),
            '&lt;&gt;&amp;&quot;'
        );
    });

    $.test('Allow HTML special characters with print(data, true)', function () {
        $.strictEqual(
            $.tmpl('{% print(o.special, true); %}', data),
            '<>&"\x00'
        );
    });

    $.test('Include template', function () {
        $.strictEqual(
            $.tmpl('{% include("template", {value: "value"}); %}', data),
            'value'
        );
    });

    $.test('If condition', function () {
        $.strictEqual(
            $.tmpl('{% if (o.value) { %}true{% } else { %}false{% } %}', data),
            'true'
        );
    });

    $.test('Else condition', function () {
        $.strictEqual(
            $.tmpl('{% if (o.empty) { %}false{% } else { %}true{% } %}', data),
            'true'
        );
    });

    $.test('For loop', function () {
        $.strictEqual(
            $.tmpl(
                '{% for (var i=0; i<o.list.length; i++) { %}' +
                    '{%=o.list[i]%}{% } %}',
                data
            ),
            '12345'
        );
    });

    $.test('For loop print call', function () {
        $.strictEqual(
            $.tmpl(
                '{% for (var i=0; i<o.list.length; i++) {' +
                    'print(o.list[i]);} %}',
                data
            ),
            '12345'
        );
    });

    $.test('For loop include template', function () {
        $.strictEqual(
            $.tmpl(
                '{% for (var i=0; i<o.list.length; i++) {' +
                    'include("template", {value: o.list[i]});} %}',
                data
            ),
            '12345'
        );
    });

    nodeQunit.teardown();

}(this));
