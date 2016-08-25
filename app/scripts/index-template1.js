function start(resource){}


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