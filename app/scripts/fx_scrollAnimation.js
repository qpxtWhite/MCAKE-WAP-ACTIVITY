;(function(global, $) {
    function isIphone(){
        var ua = navigator.userAgent.toLowerCase();
        if(/iphone/.test(ua)){
            return true;
        } else {
            return false;
        }
    }

    var useIScroll = isIphone(),
        myScroll, slTop=0, items=[], wrapHeight = $(window).height();
    function init(){
        if(useIScroll){
            $('#wapWrap').css({
                position: 'absolute',
                overflow: 'hidden',
                top: 0,
                bottom:0
            })
            document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
            myScroll = new IScroll('#wapWrap', {probeType: 3, click:false});
        } else {
            slTop = $(window).scrollTop();
        }
        var $items = $('.fx-scrollAnimation');
        $items.each(function(ix, dom){
            var $dom = $(dom),
                x = $dom.attr('fx-scrollAnimation-x'),
                y = $dom.attr('fx-scrollAnimation-y');
            $dom.attr('fx-scrollAnimation-index', ix);
            items.push({
                $dom:$dom,
                x: x,
                y: y,
                delay: $dom.attr('fx-scrollAnimation-delay') || 0,
                delayAdjust: $dom.attr('fx-scrollAnimation-delayadjust') || 0,
                top: parseInt($dom.css('top')),
                isShow: false,
                linkTo: $dom.attr('fx-scrollAnimation-linkto') || false,
                linkFrom: $dom.attr('fx-scrollAnimation-linkfrom') || false,
                duration: $dom.attr('fx-scrollAnimation-duration') || 1200
            })
            $.Velocity.hook($dom, 'opacity', 0);
            $.Velocity.hook($dom, 'translateX', x+'px');
            $.Velocity.hook($dom, 'translateY', y+'px');
        });
        initPage();
        bindScroll();
    }
    function isViewBottom(item){
        if(item.top-slTop-wrapHeight>0){
            return true;
        } else {
            return false;
        }
    }
    function initPage(){
        items.forEach(function(item){
            if(compute(item)){
                animate(item, item.delay);
            }
        })
    }
    function bindScroll(){
        if(useIScroll){
            myScroll.on('scroll', function(){
                var st = -parseInt(this.y / 10) * 10;
                if(st<slTop) return;
                slTop = st;
                items.forEach(function(item){
                    if(compute(item)){
                        animate(item, item.delayAdjust);
                    }
                });
            })
        } else {
            $(window).on('scroll', function(){
                var st = parseInt($(window).scrollTop() / 10) * 10;
                if(st<slTop) return;
                slTop = st;
                items.forEach(function(item){
                    if(compute(item)){
                        animate(item, item.delayAdjust);
                    }
                });
            })
        }
    }
    function compute(item){
        if(!item.isShow && !item.linkFrom && !isViewBottom(item)){
            return true;
        } else {
            return false;
        }
    }
    function animate(item, delay){
        item.isShow = true;
        item.$dom.velocity({
            translateX: 0,
            translateY: 0,
            opacity: 1
        }, {
            duration: item.duration,
            delay: delay,
            complete: function(){
                if(item.linkTo){
                    var ti = items[$(item.linkTo).attr('fx-scrollAnimation-index')]
                    animate(ti, 0)
                }
            }
        })
    }
    global.fx_scrollAnimation = {
        init: init
    }

})(window, $)