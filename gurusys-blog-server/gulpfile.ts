import gulp from "gulp";

// Task to copy files from public folder
gulp.task("copy-public", function () {
  return gulp.src("src/public/**/*.*").pipe(gulp.dest("dist/src/public"));
});

// Task to copy files from views folder
gulp.task("copy-views", function () {
  return gulp.src("src/views/**/*.*").pipe(gulp.dest("dist/src/views"));
});

// Default task
gulp.task("default", gulp.series("copy-public", "copy-views"));
