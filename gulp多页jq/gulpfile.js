var gulp = require('gulp'), //  手动引入模块（可以详细的看到引入了那些模块）
    less = require('gulp-less'), //  less文件编译成css 
    cleanCSS = require('gulp-clean-css'),//- 压缩CSS为一行；
    concat   = require('gulp-concat'),//- 多个文件合并为一个；
    babel = require('gulp-babel'), //  编译ES6/7等
    uglify = require('gulp-uglify'), //  压缩js
    imagemin = require('gulp-imagemin'),//图片处理
    browserSync = require('browser-sync').create(), //  实时加载(开启服务) 保证多个浏览器或设备网页同步显示 (recipes)
    connect = require('gulp-connect'), //  开启服务（另一种方法）
    autoprefixer = require('gulp-autoprefixer'), //  css 加前缀
    fileinclude = require('gulp-file-include'), //引入包含html
    clearnHtml = require("gulp-cleanhtml"), //  清洁html（删除不需要的空格，换行符等...）
    proxy = require('http-proxy-middleware'), //http代理
    base64 = require('gulp-base64'), //转base64
    del = require('del'), //清理文件夹
    gulpSequence = require('gulp-sequence'), // 同步进程
    reload = browserSync.reload;

// 开发环境
const IS_DEV = process.env.npm_lifecycle_event === "dev";
console.log("开发环境", IS_DEV)

// 定义源代码的目录和编译压缩后的目录
const SRC_DIR='./src/';   //源路径，不支持相对路径，下面也是
const DEV_DIR='./dev/';   //生成开发环境的文件
const DIST_DIR='./dist/';  //生成生产环境的文件
const DIR_NAME = IS_DEV ? DEV_DIR : DIST_DIR;

// 清理文件夹
gulp.task('cleanTask',function(cb){
    return del([DIR_NAME], cb)
})

// 压缩全部image
gulp.task('imageTask', function() {
    const TARGET = gulp.src([SRC_DIR + '**/*.{jpg,png,gif,ico}']);
    if (IS_DEV) {
        TARGET
            .pipe(gulp.dest(DIR_NAME))
            .pipe(connect.reload());
    } else {
        TARGET.pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest(DIR_NAME))
    }
});

//实时编译less  
gulp.task('cssTask', function () {  
    gulp.src([SRC_DIR + 'css/*.{css,less}']) //多个文件以数组形式传入  
        .pipe(less())
        .pipe(autoprefixer('last 10 versions', 'ie 9'))
        .pipe(base64({
            maxImageSize: 8*1024,  //小于8k的图转为base64
        }))  
        .pipe(concat('main.css'))   
        .pipe(cleanCSS())  
        .pipe(gulp.dest(DIR_NAME + 'css'))
        .pipe(connect.reload());    
});

// 编译js 转es5 并压缩
gulp.task('jsTask', function() {
    gulp.src([SRC_DIR + 'js/app/*.js'], {base: 'src'})
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(DIR_NAME))
        .pipe(connect.reload());
});

// 复制第三方库
gulp.task('copyTask',  function() {
    return gulp.src(SRC_DIR + 'js/lib/*.{js,css}', {base: 'src'}) //保存目录结构
      .pipe(gulp.dest(DIR_NAME))
});

// 压缩全部html
gulp.task('htmlTask', function() {
    gulp.src(SRC_DIR + '**/*.html')
        .pipe(clearnHtml())
        .pipe(gulp.dest(DIR_NAME))
        .pipe(connect.reload());
});

gulp.task('fileinclude', function() {
    // 适配src中所有文件夹下的所有html，排除src下的include文件夹中html
    gulp.src([SRC_DIR + '**.html', '!src/include/**.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file', //引用文件路径
            indent: true //保留文件的缩进
        }))
        .pipe(gulp.dest(DIR_NAME))
        .pipe(connect.reload());
});

// 自动刷新
gulp.task('serverTask', function() {
    connect.server({
        root: [DIR_NAME],
        port: 8181,
        livereload: true,
        middleware: function(connect, opt) {
            return [
                proxy('/exchange',  {
                    target: 'http://ex-m.libazh.com/',
                    changeOrigin:true,
                    pathRewrite: {
                        '^/exchange': '/exchange'
                    }
                }),
                proxy('/user',  {
                    target: 'http://ex-m.libazh.com/',
                    changeOrigin:true,
                    pathRewrite: {
                        '^/user': '/user'
                    }
                }),
            ]
        }
    });
});


// watch
gulp.task('watchTask', function(){
    // 监听less，js文件编译
    gulp.watch("./src/**/*.*", ['cssTask', 'jsTask']);

    // 监听html文件变化后刷新页面
    gulp.watch("./src/*.html", ['htmlTask']);

    //监听引入公共的html
    //gulp.watch('./src/**/*.html', ['fileinclude']);

    // gulp.watch(['./src/**/*.*', './src/*.*'], function(event) {
    //     console.log("监听")
    // })
})


// 监听事件
gulp.task('dev', gulpSequence('cleanTask', ['copyTask', 'cssTask', 'htmlTask', 'jsTask', 'imageTask', 'serverTask', 'watchTask']));
gulp.task('build', gulpSequence('cleanTask', ['copyTask', 'cssTask', 'htmlTask', 'jsTask', 'imageTask']));