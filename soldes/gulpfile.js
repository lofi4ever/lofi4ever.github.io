const { src, dest, watch, parallel } = require('gulp');
const { paths, isLocal } = require('./config.js');
const jsLibsOrder = require('./js-libs-order.json');
const path = require('path');

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const webpackCompiler = require('webpack');
const webpackStream = require('webpack-stream');
const gulpif = require('gulp-if');
const replace = require("gulp-replace-path");
const rename = require('gulp-rename');
const nunjucks = require("gulp-nunjucks");
const nunjucksLib = require("nunjucks");
const flatten = require("gulp-flatten");

let browserSync = require('browser-sync').create();

sass.compiler = require('node-sass');

function styles() {
  return src(paths.styles.input)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(dest(paths.styles.output))
    .pipe(gulpif(isLocal, browserSync.stream()))
}

function styleLibs() {
  return src(paths.styles.libs)
    .pipe(concat('libs.css'))
    .pipe(dest(paths.styles.output))
}

function scripts() {
  return src(paths.scripts.input)
    .pipe(webpackStream({
      mode: 'development',
      output: {
        filename: paths.scripts.filename,
      },
      devtool: 'source-map',
      plugins: [
        new webpackCompiler.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery' //for fancybox to work
        })
      ],
      resolve: {
        alias: {
          NodeModules: path.resolve(__dirname, 'node_modules')
        }
      },
      module: {
        rules: [
          {
            test: /\.(js)$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            query: {
              presets: ['@babel/preset-env'],
              plugins: [
                  "@babel/plugin-proposal-class-properties",
                  "@babel/plugin-proposal-private-methods"
                ]
            }
          }
        ]
      }
    }, webpackCompiler))
    .pipe(dest(paths.scripts.output))
}

function scriptsLibs() {
  return src(jsLibsOrder)
    .pipe(concat('libs.js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.scripts.output));
}

function render() {
  return src("./views/[^_]*.html")
    .pipe(
      nunjucks.compile(
        {},
        {
          env: new nunjucksLib.Environment(
            new nunjucksLib.FileSystemLoader("./views")
          )
        }
      )
    )
    .pipe(flatten())
    .pipe(dest("./"))
    .pipe(browserSync.stream());
}

function watcher() {
  watch([paths.scripts.src], { ignoreInitial: false }, scripts);
  watch(paths.styles.input, { ignoreInitial: false }, styles);
  if(isLocal) {
    browserSync.init({
      server: {
        baseDir: "./"
      },
      notify: false
    });
    render();
    watch("./views/**/*.html").on("change", render)
    watch(paths.scripts.outputFile).on("change", browserSync.reload);
    watch('*.html').on("change", browserSync.reload);
  }
}

function dev() {
  styleLibs();
  scriptsLibs();
  watcher();
}

exports.default = dev;