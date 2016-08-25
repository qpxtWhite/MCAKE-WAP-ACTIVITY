var cvs = {
    fly1: {"frames":[
        {"x":218,"y":0,"w":223,"h":272,"offX":49,"offY":32,"sourceW":350,"sourceH":350},
        {"x":218,"y":274,"w":244,"h":236,"offX":43,"offY":68,"sourceW":350,"sourceH":350},
        {"x":0,"y":512,"w":272,"h":185,"offX":35,"offY":119,"sourceW":350,"sourceH":350},
        {"x":0,"y":699,"w":299,"h":162,"offX":28,"offY":170,"sourceW":350,"sourceH":350},
        {"x":0,"y":863,"w":311,"h":153,"offX":26,"offY":195,"sourceW":350,"sourceH":350},
        {"x":0,"y":699,"w":299,"h":162,"offX":28,"offY":170,"sourceW":350,"sourceH":350},
        {"x":0,"y":512,"w":272,"h":185,"offX":35,"offY":119,"sourceW":350,"sourceH":350},
        {"x":218,"y":274,"w":244,"h":236,"offX":43,"offY":68,"sourceW":350,"sourceH":350},
        {"x":218,"y":0,"w":223,"h":272,"offX":49,"offY":32,"sourceW":350,"sourceH":350},
        {"x":0,"y":0,"w":216,"h":286,"offX":51,"offY":18,"sourceW":350,"sourceH":350}]},
    flower: {"frames":[
        {"x":333,"y":0,"w":164,"h":224,"offX":42,"offY":16,"sourceW":211,"sourceH":255},
        {"x":167,"y":0,"w":164,"h":224,"offX":42,"offY":16,"sourceW":211,"sourceH":255},
        {"x":0,"y":0,"w":165,"h":224,"offX":41,"offY":16,"sourceW":211,"sourceH":255}]},
    dog: {"frames":[
        {"x":0,"y":78,"w":124,"h":71,"offX":2,"offY":6,"sourceW":127,"sourceH":77},
        {"x":126,"y":150,"w":124,"h":69,"offX":1,"offY":8,"sourceW":127,"sourceH":77},
        {"x":126,"y":76,"w":124,"h":72,"offX":1,"offY":4,"sourceW":127,"sourceH":77},
        {"x":126,"y":0,"w":126,"h":74,"offX":0,"offY":2,"sourceW":127,"sourceH":77},
        {"x":0,"y":0,"w":124,"h":76,"offX":3,"offY":1,"sourceW":127,"sourceH":77}]}
}


function start(resource){
    fx_scrollAnimation.init();
    fx_movieClip.init(resource, cvs);
}


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
            domLoad.parentNode.removeChild(domLoad);
            document.getElementById('iscroll').style.display = 'block';
            start(this.getAll());
        }
    })
    loader.loadGroup('preload');
})()