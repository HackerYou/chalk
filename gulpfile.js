'use strict';

const gulp = require('gulp'),
		browserify = require('browserify'),
		source = require('vinyl-source-stream'),
		buffer = require('vinyl-buffer'),
		babelify = require('babelify'),
		browserSync = require('browser-sync'),
		reload = browserSync.reload,
		$ = require('gulp-load-plugins')(),
		scss = require("postcss-scss"),
		historyApiFallback = require('connect-history-api-fallback');

// Define paths
const paths = {
	srcCSS: './app/styles/dev/',
	distCSS: './app/styles/',
	srcGuideJS : './app/styleguide/scripts/' ,
	distGuideJS: './app/styleguide/scripts/',
	srcI: './app/images/',
	distI: './app/images/',
	srcGuideT: './app/styleguide/templates/',
	distGuideT: './app/styleguide/',
	includes: './app/src/templates/includes/',
	jsx: 'app/components/app.jsx'
}

const lint = [
	// require('stylelint')(),
	require('postcss-reporter')({ clearMessages: true, throwError: true })
];

// Setup PostCSS Plugins
const postcss = [
	require('postcss-unique-selectors')(),
	require('postcss-discard-duplicates')(),
	require('precss')(),
	require('postcss-pseudo-class-enter')(),
	require('postcss-position')(),
	require('pixrem')(),
	require('postcss-size')(),
	require('postcss-quantity-queries')(),
	require('lost')(),
	require('postcss-color-function')(),
	require('autoprefixer')({ browsers: ['last 5 versions', '> 10%'] }),
	// require('cssnano')(),
	require('postcss-reporter')({ clearMessages: true})
];

gulp.task('styles', () => {
	return gulp.src(paths.srcCSS + 'style.scss')
		.pipe($.plumber({
			errorHandler: $.notify.onError({
				title: "Style Error",
				message: "<%= error.message %>"
			})
		}))
		.pipe($.sourcemaps.init())
		// .pipe($.postcss(lint, { syntax: scss }))
		.pipe($.sass().on('error', $.sass.logError))
		.pipe($.postcss(postcss))
		.pipe($.minifyCss())
    .pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(paths.distCSS))
		.pipe(reload({stream:true}));
});

gulp.task('guidetemplate', () => {
	return gulp.src([paths.srcGuideT + '**/*.jade', '!' + paths.srcGuideT + 'layout.jade', '!' + paths.includes + '**/*.jade'])
		.pipe($.plumber({
		  errorHandler: $.notify.onError("Error: <%= error.message %>")
		}))
		.pipe($.jade({
	    pretty : true
	  }))
		.pipe(gulp.dest(paths.distGuideT))
		.pipe(reload({stream:true}));
});

gulp.task('guidescripts', () => {
	var b = browserify({
	  entries: paths.srcGuideJS + 'app.js',
	  debug: true,
	  transform: [babelify]
	});
	return b.bundle()
	  .pipe(source('main.min.js'))
	  .pipe(buffer())
	  .pipe($.sourcemaps.init({loadMaps: true}))
	  .pipe($.uglify())
	  .pipe($.plumber({
	    errorHandler: $.notify.onError("Error: <%= error.message %>")
	  }))
	  .pipe($.sourcemaps.write('.'))
	  .pipe(gulp.dest(paths.distGuideJS))
	  .pipe(reload({stream:true}));
});

gulp.task('guidewatch', () => {
	gulp.watch(paths.srcCSS + '**/*.css', ['styles']);
	gulp.watch(paths.srcGuideJS + '**/*.js', ['guidescripts']);
	gulp.watch(paths.srcGuideT + '**/*.jade', ['guidetemplate']);
});

gulp.task('bs-guide', function () {
	browserSync({
		server: {
			baseDir: './app'
		}
	})
});

gulp.task('js', function() {
	browserify(paths.jsx)
		.transform(babelify,{presets: ["es2015", "react"]})
		.bundle().on('error', $.notify.onError({
      title: "JSX Error",
      message: "<%= error.message %>"
    }))
	.pipe(source('app.min.js'))
    .pipe(buffer())
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.uglify())
    .pipe($.sourcemaps.write('.'))
	.pipe(gulp.dest('app/components'));
});

gulp.task('bs-client', function () {
	browserSync({
		server: {
			baseDir: './app'
		},
		middleware : [ historyApiFallback() ]
	})
});

gulp.task('build', ['js','styles']);

gulp.task('default', ['styles', 'js','bs-client'], () => {
	gulp.watch('app/**/*.jsx',['js']);
	gulp.watch('app/components/app.min.js', reload);
	gulp.watch(paths.srcCSS + '**/*.scss', ['styles']);
});

gulp.task('guide', ['styles', 'guidetemplate', 'guidescripts', 'bs-guide','guidewatch']);