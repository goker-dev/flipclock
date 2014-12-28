/*
 * flipclock
 * Version: 2.0.0
 * Authors: goker
 * Licensed under the MIT license
 * Demo: http://goker.be
 */

(function ($) {

    var pluginName = 'flipclock';

    var methods = {
        pad: function (n) {
            return (n < 10) ? '0' + n : n;
        },
        time: function (date) {
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
        play: function (c) {
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
        ul: function (c, d2, d1) {
            return '<ul class="flip ' + c + '">' + this.li('d2', d2) + this.li('d1', d1) + '</ul>';
        },
        li: function (c, n) {
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
        var agent = window.navigator.userAgent.match(/(chromium|chrome|safari)\//i)
        this.supported = agent && agent[0] ? true : false;
        // this.options = $.extend({}, defaults, options);
        // this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            var t, full = false, audio = false;

            if (!this.options || this.options['type'] === 'clock') {

                t = methods.time();

            } else if (this.options['countdown']) {

                t = methods.time(this.options['countdown']);
                full = true;

            } else if (this.options['type'] == 'full') {

                t = methods.time();
                full = true;
            }
            if (this.options && this.options['audio']) {

                audio = this.options['audio'];
            }

            $(this.element)
                .addClass('flipclock');

            var s = {'year': 'Y', 'month': 'M', 'day': 'D', 'hour': 'h', 'minute': 'm', 'second': 's'};
            $.each($(this.element).find('.section'), function () {
                var section = $(this).data('section');
                $(this).prepend(methods.ul(section, t[s[section]].d2, t[s[section]].d1));
            });
            if (audio) {
                $(this.element).append('<audio id="flipclick">'
                + '<source src="' + audio + '" type="audio/mpeg"/>'
                + '</audio>');
            }

            var w = $(this.element).width() / (full ? 6 : 3) >> 0;
            var h = w * .8 >> 0;
            $(this.element).find('.flip').css({
                'width': w,
                'height': h,
                'line-height': h + 'px',
                'font-size': (h * .8) + 'px'
            });


            setInterval($.proxy(this.refresh, this), 1000);

        }
        ,
        refresh: function () {
            var el = $(this.element);
            var t, l = '0';
            if (this.options && this.options['countdown']) {
                t = methods.time(this.options['countdown']);
                l = '9';
            } else
                t = methods.time();

            if (this.options && this.options['audio'])
                setTimeout(function () {
                    document.getElementById('flipclick').play()
                }, 500);

            if (this.supported) {

                // second first digit
                el.find(".second .d1 .ready .inn").html(t.s.d1);
                methods.play('.second .d1');
                // second second digit
                if ((t.s.d1 === l)) {
                    el.find(".second .d2 .ready .inn").html(t.s.d2);
                    methods.play('.second .d2');
                    // minute first digit
                    if ((t.s.d2 === l)) {
                        el.find(".minute .d1 .ready .inn").html(t.m.d1);
                        methods.play('.minute .d1');
                        // minute second digit
                        if ((t.m.d1 === l)) {
                            el.find(".minute .d2 .ready .inn").html(t.m.d2);
                            methods.play('.minute .d2');
                            // hour first digit
                            if ((t.m.d2 === l)) {
                                el.find(".hour .d1 .ready .inn").html(t.h.d1);
                                methods.play('.hour .d1');
                                // hour second digit
                                if ((t.h.d1 === l)) {
                                    el.find(".hour .d2 .ready .inn").html(t.h.d2);
                                    methods.play('.hour .d2');
                                    // day first digit
                                    if ((t.h.d2 === l)) {
                                        el.find(".day .d1 .ready .inn").html(t.D.d1);
                                        methods.play('.day .d1');
                                        // day second digit
                                        if ((t.D.d1 === l)) {
                                            el.find(".day .d2 .ready .inn").html(t.D.d2);
                                            methods.play('.day .d2');
                                            // month first digit
                                            if ((t.D.d2 === l)) {
                                                el.find(".month .d1 .ready .inn").html(t.M.d1);
                                                methods.play('.month .d1');
                                                // month second digit
                                                if ((t.M.d1 === l)) {
                                                    el.find(".month .d2 .ready .inn").html(t.M.d2);
                                                    methods.play('.month .d2');
                                                    // year first digit
                                                    if ((t.M.d2 === l)) {
                                                        el.find(".year .d1 .ready .inn").html(t.Y.d1);
                                                        methods.play('.year .d1');
                                                        // year second digit
                                                        if ((t.Y.d1 === l)) {
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

            } else {
                el.find('.year').html(t.Y.d2 + '' + t.Y.d1)
                el.find('.month').html(t.M.d2 + '' + t.M.d1)
                el.find('.day').html(t.D.d2 + '' + t.D.d1)
                el.find('.hour').html(t.h.d2 + '' + t.h.d1)
                el.find('.minute').html(t.m.d2 + '' + t.m.d1)
                el.find('.second').html(t.s.d2 + '' + t.s.d1)
            }
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$(this).data('plugin_' + pluginName)) {
                $(this).data('plugin_' + pluginName,
                    new Plugin(this, options));
            }
        });
    };

})(typeof jQuery !== 'undefined' ? jQuery : Zepto);
