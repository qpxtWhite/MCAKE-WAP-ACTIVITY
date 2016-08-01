;(function (root, factory) {
    if(typeof define === "function" && define.amd) {
        define('PubSub',[],function(){
            return factory(root);
        });
    } else if(typeof module === "object" && module.exports) {
        module.exports = factory(root);
    } else {
        root.PubSub = factory(root);
    }
}(this, function(global) {
    function isArray(obj){
        return typeof Array.isArray === 'function' ? Array.isArray(obj) : Object.prototype.toString.call(obj) === '[object Array]'
    }
    function forEach(obj, fn, context){
        if(isArray(obj)){
            if(typeof obj.forEach === 'function'){
                obj.forEach(fn, context)
            } else {
                for(var i=0, length=obj.length; i<length; i++){
                    fn.call(context, obj[i], i, obj);
                }
            }
        } else {
            for (var key in obj){
                if(Object.prototype.hasOwnProperty.call(obj, key)){
                    fn.call(context, obj[key], key, obj);
                }
            }
        }
    }

    function getRegExp(text){
        return new RegExp('^'+text.replace('.', '\\.')+'(\\.|$)');
    }

    function PubSub(){
        this._messagePool = {};
    }
    var proto = PubSub.prototype;
    proto.on = function(msg, fn, context){
        var pool = this._messagePool[msg] || (this._messagePool[msg] = []);
        pool.push({callback:fn, context: context || this});
        return this;
    }
    proto.once = function(msg, fn, context){
        var self = this;
        var cb = function(){
            self.off(msg, cb);
            fn.apply(this, arguments);
        }
        return this.on(msg, cb, context);
    }
    proto.off = function(msg, fn){
        var message, listener;
        if(typeof msg === 'string'){
            message = msg;
            listener = fn;
        } else if(typeof msg === 'function') {
            listener = msg;
        }
        if(!message && !listener){
            this._messagePool = {};
        } else {
            forEach(this._messagePool, function(value, key){
                var reg = message ? getRegExp(message) : new RegExp();
                if(message && !listener){
                    if(reg.test(key)) delete this._messagePool[key];
                } else {
                    forEach(value, function(list, index){
                        if(message && listener && reg.test(key) && list.callback === listener){
                            value.splice(index, 1);
                        } else if(!message && listener && list.callback === listener){
                            value.splice(index, 1);
                        }
                    }, this)
                }
            }, this)
        }
        return this;
    }
    proto.trigger = function(msg, data){
        if(typeof msg === 'undefined') return;
        data = Array.prototype.slice.call(arguments, 1);
        forEach(this._messagePool, function(value, key){
            if(getRegExp(msg).test(key))
                forEach(value, function(list, index){
                    list.callback.apply(list.context, data);
                }, this)
        }, this)
    }
    PubSub.mixTo = function(Receiver){
        var obj = Receiver;
        if(Object.prototype.toString.call(Receiver) === '[object Function]'){
            obj = Receiver.prototype;
        }
        obj._messagePool = {};
        forEach(PubSub.prototype, function(value, key){
            obj[key] = value;
        });
        return Receiver;
    }
    return PubSub;
}))











;(function (root, factory) {
    if(typeof define === "function" && define.amd) {
        define('Loader', ['pubsub'], function(PubSub){
            return factory(root, PubSub);
        });
    } else if(typeof module === "object" && module.exports) {
        module.exports = factory(root, require('PubSub'));
    } else {
        root.Loader = factory(root, root.PubSub);
    }
}(this, function(global, PubSub) {
    function isArray(obj){
        return typeof Array.isArray === 'function' ? Array.isArray(obj) : Object.prototype.toString.call(obj) === '[object Array]'
    }
    function forEach(obj, fn, context){
        if(isArray(obj)){
            if(typeof obj.forEach === 'function'){
                obj.forEach(fn, context)
            } else {
                for(var i=0, length=obj.length; i<length; i++){
                    fn.call(context, obj[i], i, obj);
                }
            }
        } else {
            for (var key in obj){
                if(Object.prototype.hasOwnProperty.call(obj, key)){
                    fn.call(context, obj[key], key, obj);
                }
            }
        }
    }
    var DATATYPE = {
        IMAGE: 'image'
    }

    var REG = {
        IMAGE: /\.(jpg|png|gif)$/
    }
    function getTypeByUrl(url){
        if(REG.IMAGE.test(url)) return DATATYPE.IMAGE
        return null;
    }

    var Resource = {
        loadAsset: function(url, type, success, fail){
            if(typeof type=='function') fail=success, success=type, type=undefined
            if(typeof type!='string') type = getTypeByUrl(url)
            switch(type){
                case DATATYPE.IMAGE:
                    this.loadImage(url, success, fail);
                    break;
                default:
                    console.log('type not support')
                    fail && fail(url);
                    break;
            }
        },
        loadImage: function(url, success, fail){
            var img = new Image();
            img.onload = function(){
                img.onload = new Function;
                success && success(img);
            }
            img.onerror = function(){
                img.onerror = new Function;
                console.log('load fail')
                fail && fail(url)
            }
            img.src = url;
        }
    }

    function Loader(baseUrl){
        this.baseUrl = baseUrl || '';
        this.resources = {};
        this.groups = {};
        PubSub.call(this);
    }
    Loader.prototype = Object.create(PubSub.prototype);
    Loader.prototype.constructor = Loader;
    Loader.prototype.add = function(name, url, type, options){
        if(!name || !url) throw new Error('No url passed to add loader to loader.');
        if(typeof type != 'string'){
            options = type;
            type = undefined;
        }
        if(isArray(url)) return this.addGroup(name, url, options);
        return this.resources[name] = {
            url: url,
            type: type,
            name: name
        }, this;
    }
    Loader.prototype.addGroup = function(name, data, options){
        if(!name || !data) throw new Error('No url passed to add loader to loader.');
        return this.groups[name] = data.map(function(item){
            this.resources[item.name] = item;
            return item.name;
        }, this), this;
    }
    Loader.prototype.load = function(name, options){
        if(!(name in this.resources)) return this.loadGroup(name, options);
        var self = this,
            res = this.resources[name];
        return Resource.loadAsset(this.baseUrl + res.url, res.type, function(){
            self.trigger('complete', name);
        }), this;
    }
    Loader.prototype.loadGroup = function(name, options){
        if(!(name in this.groups)) return console.log('data not exit'), this;
        var group = this.groups[name],
            total = group.length,
            loaded = 0,
            self = this,
            data = this.resources[group[loaded]];
        return Resource.loadAsset(this.baseUrl + data.url, data.type, function(){
            loaded++;
            self.trigger('progress', name, loaded, total);
            if(loaded == total){
                self.trigger('complete', name, total)
            } else {
                data = self.resources[group[loaded]]
                Resource.loadAsset(self.baseUrl + data.url, data.type, arguments.callee);
            }
        }), this;
    }
    Loader.prototype.get = function(name){
        if(this.resources[name]){
            return this.resources[name]
        } else if(this.groups[name]) {
            return this.getGroup(name);
        } else {
            return null;
        }
    }
    Loader.prototype.getGroup = function(name){
        if(this.groups[name]){
            var self = this;
            return this.groups[name].map(function(key){
                return self.resources[key];
            })
        } else {
            return null;
        }
    }
    Loader.prototype.getAll = function(){
        return this.resources;
    }

    Loader.load = function(url, callback){
        if(isArray(url)) return Loader.loadGroup(url, callback)
        return Resource.loadAsset(url, callback), Loader;
    }
    Loader.loadGroup = function(data, callback){
        var total = data.length,
            loaded = 0;
        return forEach(data, function(item, index){
            Resource.loadAsset(typeof item == 'string' ? item : item.url, item.type, function(){
                loaded++;
                callback(loaded, total);
            })
        }), Loader;
    }

    return Loader;
}))