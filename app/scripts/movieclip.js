;(function (root, factory) {
    if(typeof define === "function" && define.amd) {
        define('MovieClip', ['PubSub'], function(PubSub){
            return factory(root, PubSub);
        });
    } else if(typeof module === "object" && module.exports) {
        module.exports = factory(root, require('PubSub'));
    } else {
        root.MovieClip = factory(root, root.PubSub);
    }
}(this, function(global, PubSub) {
    if(typeof PubSub==='undefined') return alert('MovieClip依赖pubsub模块'),null;

    var requestAnimationFrame = window.requestAnimationFrame
            || window.webkitRequestAnimationFrame
            || window.mozRequestAnimationFrame
            || function(callback){ return window.setTimeout(callback, 1000/60); },
        cancelAnimationFrame = window.cancelAnimationFrame
            || window.webkitCancelAnimationFrame
            || window.mozCancelAnimationFrame
            || function(id){ clearTimeout(id); }

    function Ticker(frameRate){
        this.lastTime = 0;
        this.frameDuration = 1000 / frameRate;
        this.timer = null;
        PubSub.call(this);
    }
    Ticker.prototype = Object.create(PubSub.prototype);
    Ticker.prototype.constructor = Ticker;
    Ticker.prototype.start = function(){
        var self = this;
        this.lastTime = Date.now();
        this.timer = requestAnimationFrame(function(){
            var now = Date.now();
            self.timer = requestAnimationFrame(arguments.callee);
            if(now-self.lastTime>=self.frameDuration) {self.trigger('tick'); self.lastTime = now;}
        })
    }
    Ticker.prototype.stop = function(){
        cancelAnimationFrame(this.timer);
    }
    function MovieClip(canvas, img, frameData, options){
        var opts = options || {};
        this.ctx = canvas.getContext('2d');
        this.width = parseInt(canvas.width);
        this.height = parseInt(canvas.height);
        this.frames = frameData.frames;
        this.frameRate = frameData.frameRate || 10;
        this.img = img;
        this.repeatCount = opts.repeatCount || 0;
        this.stopFrame = opts.stopFrame || 0;   //代表最后停留帧,first代表第一帧,last代表最后一帧;
        this.currentCount = 0;
        this.currentFrame = 0;
        this.ticker = new Ticker(this.frameRate);
        this.tickCount = null;
        this.setFrame(this.currentFrame);
        this.initEvent();
    }
    var proto = MovieClip.prototype;
    proto.play = function(num){
        this.ticker.start();
    }
    proto.pause = function(){
        this.ticker.stop();
    }
    proto.next = function(){
        this.setFrame(this.currentFrame+1);
    }
    proto.prev = function(){
        this.setFrame(this.currentFrame-1);
    }
    proto.stop = function(){
        this.ticker.stop();
        this.setFrame(this.stopFrame==='first' ? 0 : this.frames.length-1);
    }
    proto.setFrame = function(num){
        if(num>this.frames.length-1) num = 0;
        if(num<0) num = this.frames.length-1;
        this.ctx.clearRect(0,0,this.width, this.height);
        var frame = this.frames[num];
        if(this.img){
            this.ctx.drawImage(this.img, frame.x, frame.y, frame.w, frame.h, frame.offX, frame.offY, frame.w, frame.h);
        } else {
            this.ctx.drawImage(frame.img, 0, 0);
        }
        this.currentFrame = num;
    }
    proto.initEvent = function(){
        var self = this;
        this.ticker.on('tick', function(){
            self.tick();
        })
    }
    proto.tick = function(){
        var dur = this.frames[this.currentFrame].duration;
        if(!dur || dur<=1){
            this.tickCount = 0;
        } else if(typeof this.tickCount === 'number') {
            this.tickCount--;
        } else {
            this.tickCount = dur-1;
        }
        if(this.tickCount===0){
            this.tickCount = null;
            this.next();
            if(this.currentFrame==0){
                this.currentCount++;
            }
            if(this.repeatCount!= 0 && this.currentCount==this.repeatCount){
                this.stop();
            }
        }
    }
    return MovieClip;
}))