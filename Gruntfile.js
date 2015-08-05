module.exports = function(grunt) {
  "use strict";

  // load all grunt tasks
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task.
  grunt.registerTask('default', ['uglify', 'cssmin']);

  // Project configuration.
  grunt.initConfig({
    uglify: {
      dist: {
        files: {
          'dist/supersecret.min.js': ['src/supersecret.js'],
        }
      },
    },
    cssmin: {
      target: {
        files: [{
          'dist/supersecret.min.css': ['src/supersecret.css']
        }]
      }
    }
  });

  grunt.config.set("config.current", grunt.file.readJSON("config/" + env +
    "/config.json"));
};
