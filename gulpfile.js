// Создание спрайта, файлов min css,js, сжатие картинок
const { src, dest, watch, parallel, series } = require ('gulp');

const scss = require ('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglyfy = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const svgSprite = require('gulp-svg-sprite');
const svgMin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');
const del = require('del');


function browsersync() {
browserSync.init({
  server: {
    baseDir:'app/'
  }
});
}

function clearDist() {
  return del('dist')
}

function styles() {
  return src('app/scss/**/*.scss')
    .pipe(scss({outputStyle:'compressed'}))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 5 version'],
      grid: true
    }))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}

function scripts() {
  return src([
    'app/js/lib.js',
    'app/js/main.js'
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglyfy())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())

}

function sprite() {
  return src('app/images/svg/*.svg')
    .pipe(svgMin({
      js2svg: {
        pretty: true
      }
      }))
    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style');
      },
      parserOptions: {xmlMode: true}
    }))
    .pipe(replace('&gt;', '>'))
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: "sprite.svg"
        }
      }
    }))
    .pipe(dest('app/images/svg'))
}

function images() {
  return src ('app/images/content/**/*')
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
      ]
    ))
    .pipe(dest('dist/images/content'))
}

function build() {
  return src([
    'app/css/style.min.css',
    'app/js/main.min.js',
    'app/*.html'
  ], {base: 'app'})
    .pipe(dest('dist'))
}

function watching() {
  watch(['app/scss/**/*.scss'],styles);
  watch(['app/js/**/*.js','!app/js/main.min.js'],scripts);
  watch(['app/*.html']).on('change',browserSync.reload);
}

exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;
exports.images = images;
exports.clearDist = clearDist;
exports.sprite = sprite;

exports.build = series(clearDist,images,build);

exports.default = parallel(styles, scripts, sprite, browsersync, watching);
