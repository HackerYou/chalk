var gulp = require('gulp'),
		browserify = require('browserify'),
		source = require('vinyl-source-stream'),
		buffer = require('vinyl-buffer'),
		babelify = require('babelify'),
		browserSync = require('browser-sync'),
		reload = browserSync.reload,
		$ = require('gulp-load-plugins')();

// Define paths
var paths = {
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

// Setup PostCSS Plugins
var processors = [
	require('precss')(),
	require('postcss-pseudo-class-enter')(), //https://github.com/jonathantneal/postcss-pseudo-class-enter
	require('postcss-position')(), // https://github.com/seaneking/postcss-position
	require('pixrem')(),
	require('postcss-size')(), // https://github.com/postcss/postcss-size
	require('postcss-quantity-queries')(), // https://github.com/pascalduez/postcss-quantity-queries
	require('autoprefixer-core')({ browsers: ['last 2 version'] }), // https://github.com/postcss/autoprefixer-core
	require('postcss-reporter')() // https://github.com/postcss/postcss-reporter
];

gulp.task('styles', function () {
	return gulp.src(paths.srcCSS + 'style.css')
		.pipe($.plumber({
		  errorHandler: $.notify.onError("Error: <%= error.message %>")
		}))
		.pipe($.sourcemaps.init())
		.pipe($.postcss(processors))
		.pipe($.minifyCss())
    .pipe($.sourcemaps.write())
		.pipe(gulp.dest(paths.distCSS))
		.pipe(reload({stream:true}));
});

gulp.task('guidetemplate', function () {
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

gulp.task('guidescripts', function () {
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

gulp.task('guidewatch', function() {
	gulp.watch(paths.srcCSS + '**/*.css', ['styles']);
	gulp.watch(paths.srcGuideJS + '**/*.js', ['guidescripts']);
	gulp.watch(paths.srcGuideT + '**/*.jade', ['guidetemplate']);
});

gulp.task('bs-guide', function () {
	browserSync({
		server: {
			baseDir: './'
		}
	})
});

gulp.task('js', function() {
	browserify(paths.jsx)
		.transform(babelify,{presets: ["es2015", "react"]})
		.bundle().on('error', function(err) {
			console.log("Error:",err.message);
		})
		.pipe(source('app.js'))
		.pipe(gulp.dest('app/components'));
});

gulp.task('bs-client', function () {
	browserSync({
		server: {
			baseDir: './app'
		}
	})
});
// gulp.task('images', function () {
// 	return gulp.src(paths.srcI + '*')
// 		.pipe($.imagemin())
// 		.pipe(gulp.dest(paths.distI));
// });

// gulp.task('default', ['styles', 'templates', 'scripts', 'images', 'browser-sync','watch']);
gulp.task('default', ['js','bs-client'], () => {
	gulp.watch('app/components/**/*.jsx',['js']);
	gulp.watch('app/components/app.js', reload);
});

gulp.task('styleguide', ['styles', 'guidetemplate', 'guidescripts', 'bs-guide','guidewatch']);






