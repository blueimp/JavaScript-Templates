/*
 * JavaScript Templates 1.0.2
 * https://github.com/blueimp/JavaScript-Templates
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 * Inspired by John Resig's JavaScript Micro-Templating:
 * http://ejohn.org/blog/javascript-micro-templating/
 */

/*jslint evil: true, regexp: true */
/*global document, define */

(function ($) {
    "use strict";
    var tmpl = function (str, data) {
        var f = !/[^\-\w]/.test(str) ? tmpl.cache[str] = tmpl.cache[str] ||
                tmpl(tmpl.load(str)) :
                    new Function(
                        tmpl.arg,
                        ("var _s=''" + tmpl.helper + ";_s+='" +
                            str.replace(tmpl.regexp, tmpl.func) +
                            "';return _s;").split("_s+='';").join("")
                    );
        f.tmpl = f.tmpl || tmpl;
        return data ? f(data) : f;
    };
    tmpl.cache = {};
    tmpl.load = function (id) {
        return document.getElementById(id).innerHTML;
    };
    tmpl.regexp = /(\s+)|('|\\)(?![^%]*%\})|(?:\{%(=|#)(.+?)%\})|(\{%)|(%\})/g;
    tmpl.func = function (s, p1, p2, p3, p4, p5, p6, o, str) {
        if (p1) { // whitespace
            return o && o + s.length !== str.length ? " " : "";
        }
        if (p2) { // single quote or backslash
            return "\\" + s;
        }
        if (p3) { // interpolation: {%=prop%}, or unescaped: {%#prop%}
            if (p3 === "=") {
                return "'+_e(" + p4 + ")+'";
            }
            return "'+(" + p4 + "||'')+'";
        }
        if (p5) { // evaluation start tag: {%
            return "';";
        }
        if (p6) { // evaluation end tag: %}
            return "_s+='";
        }
    };
    tmpl.encReg = /[<>&"\x00]/g;
    tmpl.encMap = {
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "\"": "&quot;",
        "\x00": ""
    };
    tmpl.encode = function (s) {
        return String(s || "").replace(
            tmpl.encReg,
            function (c) {
                return tmpl.encMap[c];
            }
        );
    };
    tmpl.arg = "o";
    tmpl.helper = ",_t=arguments.callee.tmpl,_e=_t.encode" +
        ",print=function(s,e){_s+=e&&(s||'')||_e(s);}" +
        ",include=function(s,d){_s+=_t(s,d);}";
    if (typeof define === "function" && define.amd) {
        // Register as an AMD module:
        define("tmpl", function () {
            return tmpl;
        });
    } else {
        $.tmpl = tmpl;
    }
}(this));
