module.exports = function(grunt) {

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-typescript");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks("grunt-baseline");
    grunt.loadNpmTasks("grunt-dts-concat");
    grunt.loadNpmTasks("grunt-ts-clean");

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        clean: {
            build: {
                src: [
                    "build/"
                ]
            },
            lib: {
                src: [
                    "lib/**/*.js",
                ]
            }
        },

        typescript: {
            build: {
                options: {
                    target: "es5",
                    module: "commonjs",
                    sourceMap: true,
                    declaration: true,
                    noImplicitAny: true
                },
                src: ['src/**/*.ts'],
                dest: 'build/src'
            },
            tests: {
                options: {
                    target: "es5",
                    module: "commonjs",
                    sourceMap: true,
                    noImplicitAny: true
                },
                src: [
                    'tests/**/*.ts'
                ],
                dest: 'build/'
            },
            benchmarks: {
                options: {
                    target: "es5",
                    module: "commonjs",
                    sourceMap: true,
                    noImplicitAny: true
                },
                src: [
                    'benchmarks/**/*.ts'
                ],
                dest: 'build/'
            }
        },

        copy: {
            build: {
                files: [
                    {
                        expand: true,
                        src: [
                            'package.json'
                        ],
                        dest: 'build/'
                    }
                ]
            },
            fixtures: {
                files: [
                    {
                        expand: true,
                        cwd: 'tests/fixtures/',
                        src: [
                            '**/*'
                        ],
                        dest: 'build/tests/fixtures/'
                    }
                ]
            },
            lib: {
                files: [
                    {
                        expand: true,
                        cwd: 'build/src/',
                        src: [
                            '**/*.js'
                        ],
                        dest: 'lib/'
                    }
                ]
            }
        },

        concat: {
            lib: {
                options: {
                    banner: '#!/usr/bin/env node\n\n'
                },
                src: ['build/src/program.js'],
                dest: 'lib/program.js'
            }
        },

        mochaTest: {
            tests: {
                options: {
                    reporter: 'spec'
                },
                src: ['build/tests/**/*.tests.js']
            }
        },

        baseline: {
            benchmarks: {
                options: {
                    baselinePath: "baseline.json",
                    useColors: true
                },
                src: [
                    "build/benchmarks/**/*.bench.js"
                ]
            }
        },

        dts_concat: {
            lib: {
                options: {
                    name: 'hl7parser',
                    main: 'build/src/index.d.ts',
                    outDir: 'lib/'
                }
            }
        },

        ts_clean: {
            lib: {
                options: {
                    verbose: false
                },
                src: ['lib/**/*'],
                dot: false
            }
        }

    });

    // Default task(s).
    grunt.registerTask("default", [ "build", "tests", "lib" ]);
    grunt.registerTask("build", [ "clean:build", "typescript:build", "copy:build" ]);
    grunt.registerTask("lib", [ "clean:lib",  "copy:lib", "ts_clean:lib", "dts_concat:lib" ]);
    grunt.registerTask("tests", [ "typescript:tests", "copy:fixtures", "mochaTest:tests" ]);
    grunt.registerTask("benchmarks", [ "typescript:benchmarks", "baseline:benchmarks" ]);
};