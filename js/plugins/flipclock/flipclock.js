/*
 * flipclock
 * Version: 1.0.1 
 * Authors: @gokercebeci
 * Licensed under the MIT license
 * Demo: http://
 */

(function($) {

    var pluginName = 'flipclock';

    var methods = {
        pad: function(n) {
            return (n < 10) ? '0' + n : n;
        },
        time: function(date) {
            if (date) {
                var e = new Date(date);
                var b = new Date();
                var d = new Date(e.getTime() - b.getTime());
            } else
                var d = new Date();
            var t = methods.pad(date ? d.getFullYear() - 70 : d.getFullYear())
                    + '' + methods.pad(date ? d.getMonth() : d.getMonth() + 1)
                    + '' + methods.pad(date ? d.getDate() - 1 : d.getDate())
                    + '' + methods.pad(d.getHours())
                    + '' + methods.pad(d.getMinutes())
                    + '' + methods.pad(d.getSeconds());
            return {
                'Y': {'d2': t.charAt(2), 'd1': t.charAt(3)},
                'M': {'d2': t.charAt(4), 'd1': t.charAt(5)},
                'D': {'d2': t.charAt(6), 'd1': t.charAt(7)},
                'h': {'d2': t.charAt(8), 'd1': t.charAt(9)},
                'm': {'d2': t.charAt(10), 'd1': t.charAt(11)},
                's': {'d2': t.charAt(12), 'd1': t.charAt(13)}
            };
        },
        play: function(c) {
            $('body').removeClass('play');
            var a = $('ul' + c + ' section.active');
            if (a.html() == undefined) {
                a = $('ul' + c + ' section').eq(0);
                a.addClass('ready')
                        .removeClass('active')
                        .next('section')
                        .addClass('active')
                        .closest('body')
                        .addClass('play');

            }
            else if (a.is(':last-child')) {
                $('ul' + c + ' section').removeClass('ready');
                a.addClass('ready').removeClass('active');
                a = $('ul' + c + ' section').eq(0);
                a.addClass('active')
                        .closest('body')
                        .addClass('play');
            }
            else {
                $('ul' + c + ' section').removeClass('ready');
                a.addClass('ready')
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
            return '<li class="' + c + '"><section class="ready"><div class="up">'
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
        this.options = options;
        // this.options = $.extend({}, defaults, options);
        // this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }
    Plugin.prototype = {
        init: function() {
            var t, full = false;

            if (!this.options || this.options == 'clock') {

                t = methods.time();

            } else if (this.options == 'date') {

                t = methods.time();
                full = true;

            } else {

                t = methods.time(this.options);
                full = true;

            }

            $(this.element)
                    .addClass('flipclock')
                    .html(
                    (full ?
                            methods.ul('year', t.Y.d2, t.Y.d1)
                            + methods.ul('month', t.M.d2, t.M.d1)
                            + methods.ul('day', t.D.d2, t.D.d1)
                            : '')
                    + methods.ul('hour', t.h.d2, t.h.d1)
                    + methods.ul('minute', t.m.d2, t.m.d1)
                    + methods.ul('second', t.s.d2, t.s.d1)
                    + '<audio id="flipclick">'
                    + '<source src="/js/plugins/flipclock/click.mp3" type="audio/mpeg"/>'
                    + '</audio>');

            setInterval($.proxy(this.refresh, this), 1000);

        },
        refresh: function() {
            var el = $(this.element);
            var t;
            if (this.options
                    && this.options != 'clock'
                    && this.options != 'date') {

                t = methods.time(this.options);

            } else
                t = methods.time()

            // second sound
            setTimeout(function() {
                document.getElementById('flipclick').play()
            }, 500);

            // second first digit
            el.find(".second .d1 .ready .inn").html(t.s.d1);
            methods.play('.second .d1');
            // second second digit
            if ((t.s.d1 === '0')) {
                el.find(".second .d2 .ready .inn").html(t.s.d2);
                methods.play('.second .d2');
                // minute first digit
                if ((t.s.d2 === '0')) {
                    el.find(".minute .d1 .ready .inn").html(t.m.d1);
                    methods.play('.minute .d1');
                    // minute second digit
                    if ((t.m.d1 === '0')) {
                        el.find(".minute .d2 .ready .inn").html(t.m.d2);
                        methods.play('.minute .d2');
                        // hour first digit
                        if ((t.m.d2 === '0')) {
                            el.find(".hour .d1 .ready .inn").html(t.h.d1);
                            methods.play('.hour .d1');
                            // hour second digit
                            if ((t.h.d1 === '0')) {
                                el.find(".hour .d2 .ready .inn").html(t.h.d2);
                                methods.play('.hour .d2');
                                // day first digit
                                if ((t.h.d2 === '0')) {
                                    el.find(".day .d1 .ready .inn").html(t.D.d1);
                                    methods.play('.day .d1');
                                    // day second digit
                                    if ((t.D.d1 === '0')) {
                                        el.find(".day .d2 .ready .inn").html(t.D.d2);
                                        methods.play('.day .d2');
                                        // month first digit
                                        if ((t.D.d2 === '0')) {
                                            el.find(".month .d1 .ready .inn").html(t.M.d1);
                                            methods.play('.month .d1');
                                            // month second digit
                                            if ((t.M.d1 === '0')) {
                                                el.find(".month .d2 .ready .inn").html(t.M.d2);
                                                methods.play('.month .d2');
                                                // year first digit
                                                if ((t.M.d2 === '0')) {
                                                    el.find(".year .d1 .ready .inn").html(t.Y.d1);
                                                    methods.play('.year .d1');
                                                    // year second digit
                                                    if ((t.Y.d1 === '0')) {
                                                        el.find(".year .d2 .ready .inn").html(t.Y.d2);
                                                        methods.play('.year .d2');
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
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

})(typeof jQuery !== 'undefined' ? jQuery : Zepto);
