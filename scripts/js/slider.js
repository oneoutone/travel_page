(function($, f) {
    var Unslider = function() {
        //  Object clone
        var _ = this;

        //  Set some options
        _.o = {
            speed: 500,     // animation speed, false for no transition (integer or boolean)
            delay: 3000,    // delay between slides, false for no autoplay (integer or boolean)
            init: 0,        // init delay, false for no delay (integer or boolean)
            pause: !f,      // pause on hover (boolean)
            loop: !f,       // infinitely looping (boolean)
            dots: f,        // display dots pagination (boolean)
            arrows: f,      // display prev/next arrows (boolean)
            prev: '&larr;', // text or html inside prev button (string)
            next: '&rarr;', // same as for prev option
            starting: f,    // invoke before animation (function with argument)
            complete: f,    // invoke after animation (function with argument)
            items: '>ul',   // slides container selector
            item: '>li',    // slidable items selector
            easing: 'swing',// easing function to use for animation
            autoplay: true  // enable autoplay on initialisation
        };

        _.init = function(el, o) {
            //  Check whether we're passing any options in to Unslider
            _.o = $.extend(_.o, o);

            _.el = el;
            _.ul = el.find(_.o.items);
            _.li = _.ul.find(_.o.item);


            //  Cached vars
            var o = _.o,
                ul = _.ul,
                li = _.li,
                len = li.length;

            //  Current indeed
            _.i = 0;


            //  Autoslide
            o.autoplay && setTimeout(function() {
                if (o.delay | 0) {
                    _.play();

                    if (o.pause) {
                        el.on('mouseover mouseout', function(e) {
                            _.stop();
                            e.type === 'mouseout' && _.play();
                        });
                    }
                }
            }, o.init | 0);

            //  Dot pagination
            o.dots && nav('dot');

            //  Arrows support
            o.arrows && nav('arrow');

            return _;
        };

        //  Move Unslider to a slide index
        _.to = function(index, callback) {
            if (_.t) {
                _.stop();
                _.play();
            }
            var o = _.o,
                el = _.el,
                ul = _.ul,
                li = _.li,
                current = _.i,
                target = li.eq(index);

        	console.log("index:"+index+" target:"+target.length+" li.length:"+li.length)
            $.isFunction(o.starting) && !callback && o.starting(el, li.eq(current));

            //  To slide or not to slide
            if ((!target.length || index < 0) && o.loop === f) return;

            //  Check if it's out of bounds
            if (!target.length || index >= li.length ) index = 0;
            if (index < 0) index = li.length-1;
            target = li.eq(index);

            var speed = callback ? 5 : o.speed | 0,
                easing = o.easing;

            if(ul[0]){
                if (!ul.queue('fx').length) {
                    el.find('.dot').eq(index).addClass('actived').siblings().removeClass('actived');
                    target.addClass('actived').siblings().removeClass('actived');
                	target.fadeIn(speed, function(data) {
                		_.i = index;
                		$.isFunction(o.complete) && !callback && o.complete(el, target);
                	});
                    target.siblings().fadeOut(speed, function(data) {
                    	_.i = index;
                    	$.isFunction(o.complete) && !callback && o.complete(el, target);
                    });
                }
            }
            
        };

        //  Autoplay functionality
        _.play = function() {
            _.t = setInterval(function() {
                _.to(_.i + 1);
            }, _.o.delay | 0);
        };

        //  Stop autoplay
        _.stop = function() {
            _.t = clearInterval(_.t);
            return _;
        };

        //  Move to previous/next slide
        _.next = function() {
            return _.stop().to(_.i + 1);
        };

        _.prev = function() {
            return _.stop().to(_.i - 1);
        };

        //  Create dots and arrows
        function nav(name, html) {
            if (name == 'dot') {
                html = '<ol class="dots">';
                $.each(_.li, function(index) {
                    html += '<li class="' + (index === _.i ? name + ' actived' : name) + '">' + ++index + '</li>';

                });
                html += '</ol>';

                _.el.addClass('has-' + name + 's').append(html).find('.' + name).stop(false,true).mouseover(function() {
                    var me = $(this);
                    me.hasClass('dot') ? _.stop().to(me.index()) : me.hasClass('prev') ? _.prev() : _.next();
                });
            } else {
                html = '<div class="' + name + ' prev" ><b>&nbsp;</b></div>' + '<div class="' + name + ' next"><b>&nbsp;</b></div>';

                _.el.addClass('has-' + name + 's').append(html).find('.' + name).click(function() {
                    var me = $(this);
                    me.hasClass('dot') ? _.stop().to(me.index()) : me.hasClass('prev') ? _.prev() : _.next();
                });
            }

        }
    };

    //  Create a jQuery plugin
    $.fn.unslider = function(o) {
        var __ = this;
        var len = this.length;
        var li = __.children().children();
        
        li.eq(0).show();

        if( li.length != 1 ){
            __.hover(function () { move('20px','0.7'); },function(){ move('20px','0'); });
            function move(data,str){
                $('.prev').stop(true,true).animate({
                    'left':data,
                    'opacity':str
                },300);
                $('.next').stop(true,true).animate({
                    'right':data,
                    'opacity':str
                },300);
            }
            //  Enable multiple-slider support
            return this.each(function(index) {
                //  Cache a copy of $(this), so it
                var me = $(this),
                    key = 'unslider' + (len > 1 ? '-' + ++index : ''),
                    instance = (new Unslider).init(me, o);

                //  Invoke an Unslider instance
                me.data(key, instance).data('key', key);
            });
        }

    };

    Unslider.version = "1.0.0";
})(jQuery, false);