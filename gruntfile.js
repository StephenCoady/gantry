let grunt = require('grunt');

grunt.loadNpmTasks('grunt-bower-install');

grunt.initConfig({
  bowerInstall: {
    target: {
      // Point to the files that should be updated when
      // you run `grunt bower-install`
      src: [
        'app/**/*.html', // .html support...
        'app/config.yml' // and .yml & .yaml support out of the box!
      ],

      // Optional:
      // ---------
      cwd: '',
      dependencies: true,
      devDependencies: false,
      exclude: [],
      fileTypes: {},
      ignorePath: '',
      overrides: {}
    }
  }
});
