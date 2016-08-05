var gulp = require('gulp');
var tinypng = require('gulp-tinypng-compress');
var webserver = require('gulp-webserver');
var os=require('os');
var ifaces=os.networkInterfaces();
var sass = require('gulp-sass');
var htmlreplace = require('gulp-html-replace');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-minify-css');
var clean = require('gulp-clean');
var ftp = require('gulp-ftp');
var gutil = require('gulp-util');


var buildConfig = require('./package.json').buildConfig;


gulp.task('tinypng', function () {
	var path = '';
	var src = '';
	if(process.argv[3] && process.argv[3]=='-p' && process.argv[4]){
		path = process.argv[4];	//获取图片路径参数
		if(/(\.png|\.jpg|\.jpeg)$/.test(path)){
			src = path;
		} else {	//如果参数为目录,则压缩目录下全部文件
			path = path.replace(/\/$/, '');	//去除参数中最后一个斜杠
			src = path + '/**/*.{png,jpg,jpeg}';
		}
	} else {
		src = 'app/images/**/*.{png,jpg,jpeg}';	//默认images文件夹下全部图片
	}

	gulp.src(src)
		.pipe(tinypng({
			key: buildConfig.tinypngKey,
			log: true
		}))
		.pipe(gulp.dest('app/images'));
});

gulp.task('server', function() {
	gulp.src('app')
		.pipe(webserver({
			host: getIP(),
			directoryListing: false,
			livereload: false,
			open: true,
			port: buildConfig.serverPort || 8001
		}));
});

gulp.task('sass', function(){
	gulp.src('app/styles/index.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('app/styles'))
})

gulp.task('sass:watch', function(){
	gulp.watch('app/styles/index.scss', ['sass']);
})

gulp.task('html-build', function(){
	return gulp.src('app/index.html')
		.pipe(htmlreplace({
			'css': buildConfig.basePath + 'styles/index.css',
			'js': buildConfig.basePath + 'scripts/index.js'
		}))
		.pipe(replace(/images\/.*\.(png|jpg)/g, function(res){
			return buildConfig.basePath + res;
		}))
		.pipe(gulp.dest('build/'))
})

gulp.task('css-build', function(){
	return gulp.src(buildConfig.buildCSS)
		.pipe(replace(/\.\.\/images\/.*\.(png|jpg)/g, function(res){
			return res.replace('../', buildConfig.basePath);
		}))
		.pipe(concat('index.css'))
		.pipe(cssmin())
		.pipe(gulp.dest('build/styles/'))
})

gulp.task('js-build', function(){
	var concat_js = buildConfig.buildJS.map(function(item){
		if(item === buildConfig.resourcePath){
			return '.tmp/' + item.match(/[^\/]+$/)[0]
		} else {
			return item;
		}
	});

	return gulp.src(concat_js)
		.pipe(concat('index.js'))
		.pipe(uglify())
		.pipe(gulp.dest('build/scripts'))
})

gulp.task('img-build', function(){
	return gulp.src('app/images/**/*.{png,jpg,jpeg,gif}')
		.pipe(gulp.dest('build/images'))
})

gulp.task('ftp', function(){
	return gulp.src('build/**/*')
		.pipe(ftp({
			host: buildConfig.ftp.host,
			user: buildConfig.ftp.user,
			pass: buildConfig.ftp.pass,
			remotePath: buildConfig.ftp.remotePath
		}))
		.pipe(gutil.noop())

})

gulp.task('resdata', function(){
	return gulp.src([buildConfig.resourcePath])
		.pipe(replace(/images\/.*\.(png|jpg)/g, function(res){
			return buildConfig.basePath + res;
		}))
		.pipe(gulp.dest('.tmp/'))
})

gulp.task('clean-tmp', function(){
	return gulp.src('.tmp', {read: false})
		.pipe(clean())
})

gulp.task('clean-build', function(){
	return gulp.src('build', {read: false})
		.pipe(clean())
})

gulp.task('build', function(){
	runSequence('clean-build', 'resdata', ['html-build', 'css-build', 'js-build', 'img-build'], 'clean-tmp', 'ftp')
})

function getIP(){
	var ip = 'localhost';
	for (var dev in ifaces) {
		ifaces[dev].every(function(details){
			if (details.family=='IPv4' && details.address!='127.0.0.1' && !details.internal) {
				ip = details.address;
				return false;
			}
			return true;
		});
	}
	return ip;
}