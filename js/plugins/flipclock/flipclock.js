/*
 * flipclock
 * Version: 1.0.0 
 * Original authors: @ademilter @gokercebeci
 * Licensed under the MIT license
 * Demo: http://
 */

(function($) {

    var pluginName = 'flipclock';

    var methods = {
        pad: function(n) {
            return (n < 10) ? '0' + n : n;
        },
        time: function() {
            var d = new Date();
            var t = methods.pad(d.getHours())
                    + '' + methods.pad(d.getMinutes())
                    + '' + methods.pad(d.getSeconds());
            return {
                'h': {'d2': t.charAt(0), 'd1': t.charAt(1)},
                'm': {'d2': t.charAt(2), 'd1': t.charAt(3)},
                's': {'d2': t.charAt(4), 'd1': t.charAt(5)}
            };
        },
        play: function(c) {
            $('body').removeClass('play');
            var a = $('ul' + c + ' section.active');
            if (a.html() == undefined) {
                a = $('ul' + c + ' section').eq(0);
                a.addClass('before')
                        .removeClass('active')
                        .next('section')
                        .addClass('active')
                        .closest('body')
                        .addClass('play');

            }
            else if (a.is(':last-child')) {
                $('ul' + c + ' section').removeClass('before');
                a.addClass('before').removeClass('active');
                a = $('ul' + c + ' section').eq(0);
                a.addClass('active')
                        .closest('body')
                        .addClass('play');
            }
            else {
                $('ul' + c + ' section').removeClass('before');
                a.addClass('before')
                        .removeClass('active')
                        .next('section')
                        .addClass('active')
                        .closest('body')
                        .addClass('play');
            }
        },
        // d1 is first digit and d2 is second digit
        ul: function(c, d2, d1) {
            return '<ul class="flip ' + c + '">' + this.li('d2', d2) + this.li('d1', d1) + '</ul>';
        },
        li: function(c, n) {
            //
            return '<li class="' + c + '"><section class="before"><div class="up">'
                    + '<div class="shadow"></div>'
                    + '<div class="inn"></div></div>'
                    + '<div class="down">'
                    + '<div class="shadow"></div>'
                    + '<div class="inn"></div></div>'
                    + '</section><section class="active"><div class="up">'
                    + '<div class="shadow"></div>'
                    + '<div class="inn">' + n + '</div></div>'
                    + '<div class="down">'
                    + '<div class="shadow"></div>'
                    + '<div class="inn">' + n + '</div></div>'
                    + '</section></li>';
        }
    };
    // var defaults = {};

    function Plugin(element, options) {
        this.element = element;
        // this.options = $.extend({}, defaults, options);
        // this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function() {

            var t = methods.time();

            $(this.element)
                    .addClass('flipclock')
                    .html(
                    methods.ul('hour', t.h.d2, t.h.d1)
                    + methods.ul('minute', t.m.d2, t.m.d1)
                    + methods.ul('second', t.s.d2, t.s.d1))

            setInterval($.proxy(this.refresh, this), 1000);

        },
        refresh: function() {
            var el = $(this.element);
            var t = methods.time();

            // second first digit
            el.find(".second .d1 .before .inn").html(t.s.d1);
            methods.play('.second .d1');
            // second second digit
            if ((t.s.d1 === '0')) {
                el.find(".second .d2 .before .inn").html(t.s.d2);
                methods.play('.second .d2');
                // minute first digit
                if ((t.s.d2 === '0')) {
                    el.find(".minute .d1 .before .inn").html(t.m.d1);
                    methods.play('.minute .d1');
                    // minute second digit
                    if ((t.m.d1 === '0')) {
                        el.find(".minute .d2 .before .inn").html(t.m.d2);
                        methods.play('.minute .d2');
                        // hour first digit
                        if ((t.m.d2 === '0')) {
                            el.find(".hour .d1 .before .inn").html(t.h.d1);
                            methods.play('.hour .d1');
                            // hour second digit
                            if ((t.h.d1 === '0')) {
                                el.find(".hour .d2 .before .inn").html(t.h.d2);
                                methods.play('.hour .d2');
                            }
                        }
                    }
                }
            }

        },
    };

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$(this).data('plugin_' + pluginName)) {
                $(this).data('plugin_' + pluginName,
                        new Plugin(this, options));
            }
        });
    };

})(typeof jQuery  !== 'undefined' ? jQuery : Zepto);
