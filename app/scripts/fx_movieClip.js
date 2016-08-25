;(function(global, $) {
    function init(resource, animateData){
        var movieDom = $('.fx-movieClip');
        movieDom.each(function(ix, canvas){
            var movieName = canvas.getAttribute('fx-movieClip-name');
            var movieSprite = canvas.getAttribute('fx-movieClip-sprite');
            new MovieClip(canvas, resource[movieSprite].data, animateData[movieName]).play();
        })
    }
    global.fx_movieClip = {
        init: init
    }

})(window, $)