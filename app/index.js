'use strict';

var fs = require('fs');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

module.exports = yeoman.generators.Base.extend({
    constructor: function() {
        yeoman.generators.Base.apply(this, arguments);

        this.option('skip-install', {
            desc: 'Skips the installation of dependencies',
            type: Boolean
        });
    },

    initializing: function() {
        this.pkg = require('../package.json');
    },

    writing: {
        gulpfile: function() {
            this.template('gulpfile.js');
        },

        packageJSON: function() {
            this.template('_package.json', 'package.json');
        },

        git: function() {
            this.copy('gitignore', '.gitignore');
            this.copy('gitattributes', '.gitattributes');
        },

        bower: function() {
            var bower = {
                name: this._.slugify(this.appname),
                private: true,
                dependencies: {
                    'angularjs': '~1.3.15',
                    'semantic': '~1.11.6'
                }
            };

            this.copy('bowerrc', '.bowerrc');
            this.write('bower.json', JSON.stringify(bower, null, 2));
        },

        jshint: function() {
            this.copy('jshintrc', '.jshintrc');
        },

        editorConfig: function() {
            this.copy('editorconfig', '.editorconfig');
        },


        mainStylesheet: function() {
            var css = 'main.css';
            this.copy(css, 'app/styles/' + css);
        },

        writeIndex: function() {
            this.indexFile = this.src.read('index.html');
            this.indexFile = this.engine(this.indexFile, this);
            this.write('app/index.html', this.indexFile);
        },

        app: function() {
            this.mkdir('app');
            this.mkdir('app/scripts');
            this.mkdir('app/styles');
            this.mkdir('app/images');
            this.mkdir('app/fonts');
            this.copy('scripts/app.js', 'app/scripts/app.js');
            this.copy('scripts/app-controller.js', 'app/scripts/app-controller.js');
            this.copy('scripts/app-service.js', 'app/scripts/app-service.js');
            this.copy('scripts/app-directives.js', 'app/scripts/app-directives.js');
        },

        tests: function () {
            this.mkdir('tests');
            this.copy('tests/e2e/app_spec.js', 'tests/e2e/app_spec.js');
            this.copy('tests/protractor.conf.js', 'tests/protractor.conf.js');
        }

    },

    install: function() {
        var howToInstall = '\nAfter running ' + chalk.yellow.bold('npm install & bower install');

        if (this.options['skip-install']) {
            this.log(howToInstall);
            return;
        }

        this.installDependencies({
            skipInstall: this.options['skip-install']
        });

    }
});
