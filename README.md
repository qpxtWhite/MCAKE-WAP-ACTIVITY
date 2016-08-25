# MCAKE-WAP-ACTIVITY
MCAKE WAP端活动模板
### 资源加载
详见demo [https://qpxtwhite.github.io/MCAKE-WAP-ACTIVITY/demo/index-template1.html](https://qpxtwhite.github.io/MCAKE-WAP-ACTIVITY/demo/index-template1.html)<br>
资源配置文件可用白鹭的[ResDepot](http://www.egret.com/products/others.html#res-depot)制作
### 序列帧动画
详见demo [https://qpxtwhite.github.io/MCAKE-WAP-ACTIVITY/demo/index-template1.html](https://qpxtwhite.github.io/MCAKE-WAP-ACTIVITY/demo/index-template1.html)<br>
序列帧动画配置可以用[Texture Merger](http://www.egret.com/products/others.html#egret-texture)的Sprite Sheet功能<br>
加载fx_movieClip.js，给html中的canvas增加类fx-movieClip，定义变量cvs存放各个序列帧动画的配置。各属性说明如下：
* fx-movieClip-name：序列帧动画名，同时也是cvs中的对象名；
* fx-movieClip-sprite：序列帧用到的雪碧图，将会从loader中加载；

### 滚动动画效果
详见demo [https://qpxtwhite.github.io/MCAKE-WAP-ACTIVITY/demo/index-template1.html](https://qpxtwhite.github.io/MCAKE-WAP-ACTIVITY/demo/index-template1.html)<br>
加载fx_scrollAnimation.js，给html中需要动画的元素增加类fx-scrollAnimation。各属性说明如下：
* fx-scrollAnimation-x：x偏移量；
* fx-scrollAnimation-y：y偏移量；
* fx-scrollAnimation-delay：页面初始化时，延迟出现的值；
* fx-scrollAnimation-delayadjust：滚动时，延迟值；
* fx-scrollAnimation-linkto：出现以后，紧接着需要做动画的元素；
* fx-scrollAnimation-duration：动画持续时间；

###### 在iphone的微信中，页面滚动时会禁止一切页面效果（包括js和css动画），所以在iphone中用iscroll处理滚动；部分android机，iscroll不兼容
### build发布
在package.json中，自行配置buildConfig
