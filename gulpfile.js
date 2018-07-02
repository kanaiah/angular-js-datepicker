'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass');
var clean = require('gulp-clean');

var srcJsFiles = [
    "./src/*.js"
];
var srcScssFiles = ["./src/**/*.scss"];

/* run task */
const distDir = "./public/build";
const cssDistDir = distDir + "/css";
const jsDistDir = distDir + "/js";

gulp.task("clean-dist-dir", function (event) {
    return gulp.src(distDir).pipe(clean());
});

gulp.task("copy-js-files", function (event) {
    return gulp.src(srcJsFiles).pipe(gulp.dest(jsDistDir));
});

gulp.task("process-scss-concatenate", function (event) {
    return gulp
        .src(srcScssFiles)
        .pipe(sass().on("error", sass.logError))
        .pipe(cleanCSS())
        .pipe(gulp.dest(cssDistDir));
});

gulp.task("run", function (done) {
    runSequence(
        "clean-dist-dir",
        'copy-js-files',
        "process-scss-concatenate",
        function () {
            done();
        }
    );
});

gulp.task("watch", function () {
    gulp.watch("./src/**/*.*", function () {
        runSequence("run");
    });
});

gulp.task("default", ["watch"]);