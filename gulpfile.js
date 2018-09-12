const gulp = require("gulp");
const nunjucksRender = require("gulp-nunjucks-render");
const data = require("gulp-data");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const minify = require("gulp-minify");
const browserSync = require("browser-sync").create();

// Gets .njk files in pages
// Gets data.json
// Outputs in src - can use HTML includes
gulp.task("nunjucks", function() {
  return gulp
    .src("src/pages/**/*.+(html|nunjucks|njk)")
    .pipe(
      data(function() {
        return require("./src/data/data.json");
      })
    )
    .pipe(
      nunjucksRender({
        path: ["src/templates"] // Renders template
      })
    )
    .pipe(gulp.dest("src"));
});

// Compile Sass & Inject Into Browser
gulp.task("sass", function() {
  return gulp
    .src(["src/scss/*.scss"])
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.stream());
});

// Grab jQuery, Custom JS, Bootstrap JS, & Popper - Output to scripts.js
gulp.task("js", function() {
  return gulp
    .src([
      "node_modules/jquery/dist/jquery.min.js",
      "node_modules/popper.js/dist/umd/popper.min.js",
      "node_modules/bootstrap/dist/js/bootstrap.min.js",
      "src/js/components/**/*.js"
    ])
    .pipe(concat("scripts.js"))
    .pipe(
      minify({
        ext: {
          src: "-debug.js",
          min: ".js"
        }
      })
    )
    .pipe(gulp.dest("src/js"))
    .pipe(browserSync.stream());
});

// Watch Sass & Serve
gulp.task("serve", ["sass"], function() {
  browserSync.init({
    server: "./src"
  });
  gulp.watch(
    [
      "src/scss/**/*.scss",
      "src/pages/**/*.+(html|nunjucks|njk)",
      "src/templates/**/*.+(html|nunjucks|njk)",
      "src/js/components/**/*.js"
    ],
    ["nunjucks", "sass", "js"]
  );
  gulp.watch("src/*.html").on("change", browserSync.reload);
});

// Move Fonts to src/fonts
gulp.task("fonts", function() {
  return gulp
    .src("node_modules/font-awesome/fonts/*")
    .pipe(gulp.dest("src/fonts"));
});

gulp.task("default", ["nunjucks", "sass", "js", "serve", "fonts"]);
