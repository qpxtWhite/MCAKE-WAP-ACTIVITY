
/*** 业务模板 ***/
function getTPL(data) {
    return '' +
        '<div class="bg"><img src="'+ data['bg_jpg'].url +'" alt=""></div>'+
        '<div class="spoon"><img src="'+ data['spoon_png'].url +'" alt=""></div>' +
        '<div class="caketop">' +
            '<img src="'+ data['caketop_png'].url +'" alt="">' +
            '<a href="javascript:;" id="link1"></a>' +
        '</div>' +
        '<div class="title"><img src="'+ data['title_png'].url +'" alt=""></div>' +
        '<div class="shengqiao">' +
            '<img src="'+ data['chocolate_png'].url +'" alt="">'+
            '<canvas width="169" height="143" id="shengqiao"></canvas>' +
            '<a href="javascript:;" id="link6"></a>'+
        '</div>' +
        '<div class="cakemid">' +
            '<img src="'+ data['cakemid_png'].url +'" alt="">' +
            '<a href="javascript:;" id="link2"></a>' +
        '</div>' +
        '<div class="buy1">' +
            '<img src="'+ data['buy1_png'].url +'" alt="">' +
            '<a href="javascript:;" id="link3"></a>' +
        '</div>' +
        '<div class="wine"><img src="'+ data['wine_png'].url +'" alt=""></div>' +
        '<div class="flow"><img src="'+ data['flow_png'].url +'" alt=""></div>' +
        '<div class="flat"><img src="'+ data['flat_png'].url +'" alt=""></div>' +
        '<div class="flow2"><img src="'+ data['flow2_png'].url +'" alt=""></div>' +
        '<div class="flowers"><img src="'+ data['flowers_png'].url +'" alt=""></div>' +
        '<div class="buy2">' +
            '<img src="'+ data['buy2_png'].url +'" alt="">' +
            '<a href="javascript:;" id="link4"></a>' +
        '</div>' +
        '<div class="flow3"><img src="'+ data['flow3_png'].url +'" alt=""></div>' +
        '<div class="cakebox">' +
            '<img src="'+ data['cakebox_png'].url +'" alt="">' +
            '<a href="javascript:;" id="link5"></a>' +
        '</div>' +
        '<div class="rules"><img src="'+ data['rules_png'].url +'" alt=""></div>' +
        '<img style="display:none;" id="canvasImg" src="'+ data['vsop_png'].url +'">'
}
/*** 业务模板 ***/


/*** 业务逻辑start ***/
function drawCanvas(){
    var frames = [
        {"x":116,"y":88,"w":90,"h":99,"offX":9,"offY":8,"sourceW":169,"sourceH":143,"duration":0.5},
        {"x":117,"y":0,"w":114,"h":86,"offX":16,"offY":21,"sourceW":169,"sourceH":143,"duration":0.2},
        {"x":0,"y":0,"w":115,"h":86,"offX":16,"offY":21,"sourceW":169,"sourceH":143,"duration":0.5},
        {"x":0,"y":88,"w":114,"h":86,"offX":16,"offY":21,"sourceW":169,"sourceH":143,"duration":0.5},
        {"x":0,"y":0,"w":115,"h":86,"offX":16,"offY":21,"sourceW":169,"sourceH":143,"duration":0.5},
        {"x":0,"y":88,"w":114,"h":86,"offX":16,"offY":21,"sourceW":169,"sourceH":143,"duration":0.5},
        {"x":0,"y":0,"w":115,"h":86,"offX":16,"offY":21,"sourceW":169,"sourceH":143,"duration":0.5},
        {"x":0,"y":88,"w":114,"h":86,"offX":16,"offY":21,"sourceW":169,"sourceH":143,"duration":0.5},
        {"x":0,"y":0,"w":115,"h":86,"offX":16,"offY":21,"sourceW":169,"sourceH":143,"duration":0.5},
        {"x":0,"y":88,"w":114,"h":86,"offX":16,"offY":21,"sourceW":169,"sourceH":143,"duration":0.5}
    ]
    var img = document.getElementById('canvasImg');
    var ix = 0;
    var canvas = document.getElementById('shengqiao');
    var ctx = canvas.getContext('2d');
    drawImg();
    function drawImg(){
        var frame = frames[ix];
        ctx.clearRect(0,0,169,143)
        ctx.drawImage(img, frame.x, frame.y, frame.w, frame.h, frame.offX, frame.offY, frame.w, frame.h);
        ix++;
        if(ix==frames.length){
            ix = 0;
        }
        setTimeout(drawImg, frame.duration*1000)
    }
}
function start(){
    drawCanvas();
}
/*** 业务逻辑end ***/




;(function(){
    var loader = new Loader();
    var domLoad = document.getElementById('loading');
    loader.addGroup('preload', resData);
    loader.on('progress', function(groupName, ix, len){
        if(groupName == 'preload'){
            domLoad.innerHTML = parseInt(ix/len*100) + '%';
        }
    })
    loader.on('complete', function(groupName){
        if(groupName == 'preload'){
            document.getElementById('wapWrap').innerHTML = getTPL(this.getAll())
            start();
        }
    })
    loader.loadGroup('preload');
})()