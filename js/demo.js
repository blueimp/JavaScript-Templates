/*
 * JavaScript Templates Demo JS 2.4.0
 * https://github.com/blueimp/JavaScript-Templates
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*global window, $ */

$(function () {
    'use strict';

    var render = function (event) {
            event.preventDefault();
            var result;
            try {
                result = window.tmpl(
                    $('#template').val(),
                    $.parseJSON($('#data').val())
                );
            } catch (e) {
                result = window.tmpl('tmpl-error', e);
            }
            $('#result').html(result);
        },
        init = function (event) {
            if (event) {
                event.preventDefault();
            }
            $('#template').val($.trim($('#tmpl-demo').html()));
            $('#data').val($.trim($('#tmpl-data').html()));
            $('#result').empty();
        },
        error = function (e) {
            $('#result').html(
                window.tmpl('tmpl-error', e.originalEvent.message)
            );
        };
    $(window).on('error', error);
    $('#render').on('click', render);
    $('#reset').on('click', init);
    init();

});
