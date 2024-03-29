const gulp = require('gulp');
const gulpSass = require('gulp-sass')(require('sass'));
const gulpAutoPrefixer = require('gulp-autoprefixer');
const gulpCleanCSS = require('gulp-clean-css');
const gulpBabel = require('gulp-babel');
const gulpBabelMinify = require('gulp-babel-minify');
const gulpTokenReplace = require('gulp-token-replace');
const gulpFileInclude = require('gulp-file-include');
const gulpReplace = require('gulp-replace');
const gulpRename = require('gulp-rename');
const gulpJavaScriptObfuscator = require('gulp-javascript-obfuscator');

const packages = './package.json';
const config = './config.json';

// Generate Styles
gulp.task('styles', function () {
    return gulp.src([
        './docs/assets/styles/*.{css,scss}'
    ]).pipe(gulpSass()).pipe(gulp.dest('./docs/assets/styles'));
});
// Generate Prefixed Styles
gulp.task('styles:prefixed', function () {
    return gulp.src('./docs/assets/styles/*.css')
        .pipe(gulpAutoPrefixer({
            cascade: false,
        })).pipe(gulp.dest('./docs/assets/styles'));
});
// Generate Minified Styles
gulp.task('styles:minify', function () {
    return gulp.src('./docs/assets/styles/*.{css,scss}')
        .pipe(gulpCleanCSS({
            level: {
                1: {
                    specialComments: 0,
                },
            },
        }))
        .pipe(gulpReplace('-tw', '-elcreative'))
        .pipe(gulp.dest('./docs/assets/styles'));
});

// Generate Scripts
gulp.task('script', function () {
    return gulp.src([
        './dev/scripts/defer.js',
        './dev/scripts/script.js',
    ]).pipe(gulpBabel()).pipe(gulp.dest('./docs/assets/scripts'));
});
// Generate Minified Script
gulp.task('script:minify', function () {
    return gulp.src([
        './docs/assets/scripts/defer.js',
        './docs/assets/scripts/script.js',
    ])
        .pipe(gulpBabelMinify({
            mangle: {
                keepClassName: false,
            },
            evaluate: false,
            builtIns: false,
            removeDebugger: true,
            removeConsole: true,
        })).pipe(gulp.dest('./docs/assets/scripts'));
});
gulp.task('script:obfuscate', function () {
    return gulp.src([
        './docs/assets/scripts/defer.js',
        './docs/assets/scripts/script.js',
    ])
        .pipe(gulpJavaScriptObfuscator({
            compact: true
        })).pipe(gulp.dest('./docs/assets/scripts'));
});

// Final Tasks
gulp.task('start', function () {
    delete require.cache[require.resolve(packages)];
    const tokenData = require(config);

    return gulp.src('dev/dev.html')
        .pipe(gulpTokenReplace({
            global: tokenData,
        }))
        .pipe(gulpFileInclude({
            indent: true,
            basepath: '@@file',
            prefix: '@@',
        }))
        .pipe(gulpTokenReplace({
            global: tokenData,
        }))
        .pipe(gulpRename({
            basename: 'root',
            extname: '.html',
        })).pipe(gulp.dest('./docs'));
});


// Preview
gulp.task('preview', function () {
    return gulp.src('./docs/root.html')
        .pipe(gulpReplace('../', ''))
        .pipe(gulp.dest('./docs'));
});

// Production Mode
gulp.task('build', gulp.series('styles', 'styles:prefixed', 'styles:minify', 'script', 'script:minify', 'script:obfuscate', 'start'));
gulp.task('preview', gulp.series('styles', 'styles:prefixed', 'styles:minify', 'script', 'script:minify', 'start', 'preview'));