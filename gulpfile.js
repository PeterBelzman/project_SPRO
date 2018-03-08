'use strict';

// ------------all gulp variables
var gulp = require('gulp');
var watch = require('gulp-watch');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var scss = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var rigger = require('gulp-rigger');
// var useref = require('gulp-useref');
var cssmin = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
// var removeHtmlComments = require('gulp-remove-html-comments');
var pngquant = require('imagemin-pngquant');
var rimraf = require('rimraf');
var browserSync = require("browser-sync").create();
var reload = browserSync.reload;
var ghpages = require('gh-pages');
// var ghPages = require('gulp-gh-pages');


// ------------ path object
var path = {
    // ------------ path to
    dist: { //path to distribution
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/',
        vendor: 'dist/vendor/'
    },
    app: { //path of sources
        html: 'app/*.html', //all files with .html extensions
        js: 'app/js/main.js',
        scss: 'app/scss/main.scss',
        img: 'app/img/**/*.*', // app/img/**/*.* take all files with any extensions from catalog and in catalogs
        fonts: 'app/fonts/**/*.*',
        fontawesome: 'bower_components/components-font-awesome/fonts/fontawesome-webfont.*'

    },
    watch: { //path of watching
        html: 'app/**/*.html',
        js: 'app/js/**/*.js',
        scss: 'app/scss/**/*.scss',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    bower: { //path of bower components
        // bootstrap: 'bower_components/bootstrap/dist/',
        jquery: 'bower_components/jquery/dist/',
        normalize: 'bower_components/normalize-css/normalize.css',
        font_awesome: 'bower_components/components-font-awesome/',
        html5shiv: 'bower_components/html5shiv/dist/'
    },
    clean: 'dist' //clean up all distribution
};

// HTML
gulp.task('html:dist', function () {
    gulp.src(path.app.html)
        .pipe(rigger())
        // .pipe(removeHtmlComments())
        .pipe(gulp.dest(path.dist.html))
        .pipe(reload({
            stream: true
        }));
});

// JS
gulp.task('js:dist', function () {
    gulp.src(path.app.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dist.js))
        .pipe(reload({
            stream: true
        }));
});

// SCSS
gulp.task('scss:dist', function () {
    gulp.src(path.app.scss)
        .pipe(sourcemaps.init())
        .pipe(scss(
            // {outputStyle: 'compressed'}
        )
            .on('error', scss.logError))
        .pipe(autoprefixer({
            browsers: ['last 3 versions']
            // cascade: false
        }))
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dist.css))
        .pipe(reload({
            stream: true
        }));
});

// IMG
gulp.task('image:dist', function () {
    gulp.src(path.app.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.dist.img))
        .pipe(reload({
            stream: true
        }));
});

// FONTS
gulp.task('fonts:dist', function () {
    gulp.src(path.app.fonts)
        .pipe(gulp.dest(path.dist.fonts))
});

gulp.task('dist', [
    'html:dist',
    'js:dist',
    'scss:dist',
    'fonts:dist',
    'image:dist'
]);

//-------------------------------------Vendors

// Jquery
gulp.task('vendor:jquery', function () {
    gulp.src(path.bower.jquery + '*.min.js')
        .pipe(gulp.dest(path.dist.vendor + 'jquery/'));
});

// Normalize
gulp.task('vendor:normalize', function () {
    gulp.src(path.bower.normalize)
        .pipe(gulp.dest(path.dist.vendor + 'normalize/'));
});

// html5shiv
gulp.task('vendor:html5shiv', function () {
    gulp.src(path.bower.html5shiv + '*.js')
        .pipe(gulp.dest(path.dist.vendor + 'html5shiv/'));
});

// font_awesome
gulp.task('vendor:font_awesome', function () {
    gulp.src([
        path.bower.font_awesome + '**/*.min.css',
        path.bower.font_awesome + '**/fontawesome-webfont.*'
    ])
        .pipe(gulp.dest(path.dist.vendor + 'font-awesome/'));
});

gulp.task('vendors', [
    'vendor:jquery',
    'vendor:font_awesome',
    'vendor:html5shiv',
    'vendor:normalize'
]);


gulp.task('watch', function () {
    watch([path.watch.html], function () {
        gulp.start('html:dist');
    });
    watch([path.watch.scss], function () {
        gulp.start('scss:dist');
    });
    watch([path.watch.js], function () {
        gulp.start('js:dist');
    });
    watch([path.watch.img], function () {
        gulp.start('image:dist');
    });
    watch([path.watch.fonts], function () {
        gulp.start('fonts:dist');
    });
});

// Переменная с настройками dev сервера
var config = {
    server: {
        baseDir: "dist"
    }
    ,
    browser: [
        "chrome"
        // Chrom canary
        //     "firefox"
    ]
};

gulp.task('webserver', function () {
    browserSync.init(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

// gulp.task('deploy', function () {
//     return gulp.src("./dist/**/*")
//         .pipe(ghPages());
// });


gulp.task('default',
    [
        'dist',
        'webserver',
        'vendors',
        'watch'
    ]
);


