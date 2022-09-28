const fs = require('fs');
const del = require('del');
const gulp = require('gulp');
const gulpSass = require('gulp-sass')(require('sass'));
const gulpAutoPrefixer = require('gulp-autoprefixer');
const gulpCleanCSS = require('gulp-clean-css');
const gulpBabel = require('gulp-babel');
const gulpBabelMinify = require('gulp-babel-minify');
const gulpTokenReplace = require('gulp-token-replace');
const gulpStripComments = require('gulp-strip-comments');
const gulpFileInclude = require('gulp-file-include');
const gulpReplace = require('gulp-replace');
const gulpRename = require('gulp-rename');
const gulpJsonMinify = require('gulp-jsonminify');

const packages = './package.json';
const config = './config.json';

// Clean everything inside /build directory
gulp.task('clean', function () {
    return del(['build/**'], {
        force: true,
    });
});

// Generate Styles
gulp.task('styles', function () {
    return gulp.src(['./src/assets/styles/*.{css,scss}', './src/assets/styles/fonts/*.{css,scss}', './src/assets/styles/fonts/secondary/*.{css,scss}']).pipe(gulpSass()).pipe(gulp.dest('./build/styles'));
});
// Generate Prefixed Styles
gulp.task('styles:prefixed', function () {
    return gulp
        .src('./build/styles/*.css')
        .pipe(
            gulpAutoPrefixer({
                cascade: false,
            })
        )
        .pipe(gulp.dest('./build/styles'));
});
// Generate Minified Styles
gulp.task('styles:minify', function () {
    return gulp
        .src('./build/styles/*.{css,scss}')
        .pipe(
            gulpCleanCSS({
                level: {
                    1: {
                        specialComments: 0,
                    },
                },
            })
        )
        .pipe(gulp.dest('./build/styles'));
});

// Generate Scripts
gulp.task('script', function () {
    return gulp.src(['src/assets/scripts/*.js', 'src/assets/scripts/libraries/*.js']).pipe(gulpBabel()).pipe(gulp.dest('./build/scripts'));
});
// Generate Minified Script
gulp.task('script:minify', function () {
    return gulp
        .src('build/scripts/*.js')
        .pipe(
            gulpBabelMinify({
                mangle: {
                    keepClassName: false,
                },
                evaluate: false,
                builtIns: false,
                removeDebugger: true,
                removeConsole: true,
            })
        )
        .pipe(gulp.dest('./build/scripts'));
});

// Generate JSON (Schema)
gulp.task('json:minify', function () {
    return gulp.src('./src/assets/scripts/json/*.json').pipe(gulpJsonMinify()).pipe(gulp.dest('./build/scripts/json'));
});
// Generate Replaced JSON Data
gulp.task('json:replace', function () {
    return gulp.src('./build/scripts/json/*.json').pipe(gulpReplace('dataBlogTitleJsonEscaped', '<data:blog.title.jsonEscaped/>')).pipe(gulpReplace('dataBlogHomepageUrlJsonEscaped', '<data:blog.homepageUrl.jsonEscaped/>')).pipe(gulpReplace('dataBlogSearchUrl', '<data:blog.searchUrl.jsonEscaped/>')).pipe(gulpReplace('dataPostUrlCanonicalJsonEscaped', '<data:post.url.canonical.jsonEscaped/>')).pipe(gulpReplace('dataPostTitleJsonEscaped', '<data:post.title.jsonEscaped/>')).pipe(gulpReplace('dataPostBodySnippet', "<b:eval expr='(data:post.body snippet {length: 150, links: false, linebreaks: false, ellipsis: true}).jsonEscaped'/>")).pipe(gulpReplace('dataPostDateIso8601JsonEscaped', '<data:post.date.iso8601.jsonEscaped/>')).pipe(gulpReplace('dataPostLastUpdatedIso8601JsonEscaped', '<data:post.lastUpdated.iso8601.jsonEscaped/>')).pipe(gulpReplace('dataPostAuthorNameJsonEscaped', '<data:post.author.name.jsonEscaped/>')).pipe(gulpReplace('dataPostFeaturedImage', "<b:eval expr='data:post.featuredImage.isResizable ? resizeImage(data:post.featuredImage, 1200, &quot;1200:630&quot;) : &quot;https://lh3.googleusercontent.com/ULB6iBuCeTVvSjjjU1A-O8e9ZpVba6uvyhtiWRti_rBAs9yMYOFBujxriJRZ-A=w1200&quot;'/>")).pipe(gulpReplace('dataMessagesHome', '<data:messages.home/>')).pipe(gulpReplace('dataPostLabelsFirstName', '<b:eval expr="data:post.labels ? data:post.labels.first.name : data:messages.home" />')).pipe(gulpReplace('dataPostLabelsFirstUrlCanonical', '<b:eval expr="data:post.labels ? data:post.labels.first.url.canonical : data:blog.homepageUrl.canonical" />')).pipe(gulp.dest('./build/scripts/json'));
});

// Final Tasks
gulp.task('start', function () {
    delete require.cache[require.resolve(packages)];
    const tokenData = require(config);

    return gulp
        .src('src/github.html')
        .pipe(
            gulpTokenReplace({
                global: tokenData,
            })
        )
        .pipe(
            gulpFileInclude({
                indent: true,
                basepath: '@@file',
                prefix: '@@',
            })
        )
        .pipe(gulpReplace('<div id="app" class="app"></div>', ''))
        .pipe(gulpReplace('-tw', '-elcreative'))
        .pipe(
            gulpTokenReplace({
                global: tokenData,
            })
        )
        .pipe(
            gulpRename({
                basename: 'index',
                extname: '.html',
            })
        )
        .pipe(gulp.dest('./dist'));
});

gulp.task('preview', function () {
    delete require.cache[require.resolve(packages)];
    const tokenData = require(config);

    return gulp
        .src('src/index.html')
        .pipe(gulpReplace("@@include('../src/partials/main.html')", ''))
        .pipe(gulpReplace("@@include('../src/partials/head.html')", ''))
        .pipe(gulpReplace("{{config.cdataStart}}", ''))
        .pipe(gulpReplace("{{config.cdataEnd}}", ''))
        .pipe(gulpReplace("<?xml version='1.0' encoding='UTF-8' ?>", ''))
        .pipe(
            gulpTokenReplace({
                global: tokenData,
            })
        )
        .pipe(
            gulpFileInclude({
                indent: true,
                basepath: '@@file',
                prefix: '@@',
            })
        )
        .pipe(gulpReplace("<data:view.isPage />", "true"))
        .pipe(gulpReplace('-tw', '-elcreative'))
        .pipe(
            gulpTokenReplace({
                global: tokenData,
            })
        )
        .pipe(
            gulpRename({
                basename: 'index',
                extname: '.html',
            })
        )
        .pipe(gulp.dest('./dist'));
});

// Strip Comments
gulp.task('comments', function () {
    return gulp
        .src('dist/index.html')
        .pipe(
            gulpStripComments({
                trim: true,
            })
        )
        .pipe(gulp.dest('./dist'));
});

// Production Mode
gulp.task('build:preview', gulp.series('clean', 'styles', 'styles:prefixed', 'styles:minify', 'script', 'script:minify', 'json:minify', 'json:replace', 'preview', 'comments'));
gulp.task('build:production', gulp.series('clean', 'styles', 'styles:prefixed', 'styles:minify', 'script', 'script:minify', 'json:minify', 'json:replace', 'start', 'comments'));
// Development Mode
gulp.task('build:development', gulp.series('clean', 'styles', 'script', 'start'));