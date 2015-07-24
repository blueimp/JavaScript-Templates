/*
 * JavaScript Templates Gruntfile
 * https://github.com/blueimp/JavaScript-Templates
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*global module */

module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'js/compile.js',
                'js/demo.js',
                'js/runtime.js',
                'js/tmpl.js',
                'test/test.js'
            ]
        },
        simplemocha: {
            options: {
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'spec'
            },
            all: {
                src: ['test/test.js']
            }
        },
        uglify: {
            production: {
                src: [
                    'js/tmpl.js'
                ],
                dest: 'js/tmpl.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-bump-build-git');

    grunt.registerTask('test', ['jshint', 'simplemocha']);
    grunt.registerTask('default', ['test', 'uglify']);

};
