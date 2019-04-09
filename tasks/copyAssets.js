/*

Copies the assets directory over to /build

*/

var shell = require("shelljs");

module.exports = function(grunt) {

  grunt.registerTask("copy", "Copy assets directory", function() {
    if (grunt.file.exists("src/assets")) {
      if (!grunt.file.exists("build/assets")) shell.mkdir("-p", "build/assets");

      shell.cp("-r", "src/assets", "build");

    }
  });

  grunt.registerTask("update-shootings", "Update the shootings data file.", function() {
    if (grunt.file.exists("data")) {
      if (grunt.file.exists("data/school_shootings_data.sheet.json")) {
        shell.cat("tasks/shootings-preface.txt").to('src/js/interactiveData.js');
        shell.cat("data/school_shootings_data.sheet.json").toEnd('src/js/interactiveData.js');
        shell.cat("tasks/shootings-suffix.txt").toEnd('src/js/interactiveData.js');
      } else {
        return grunt.fail.warn( "Couldn't find data/school_shootings_data.sheet.json" );
      }
    } else {
      return grunt.fail.warn( "Couldn't open the data directory." );
    }
  });

}
