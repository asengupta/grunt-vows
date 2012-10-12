/*
 * grunt-vows
 * https://github.com/CMTegner/grunt-vows
 *
 * Copyright (c) 2012 Christian Maughan Tegnér
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
    "use strict";

    var helpers = require("../src/vows").init(grunt);

    /**
     * Convenience method for writing data to streams.
     * This method ensures that data that only contains line feeds is not written.
     * Note that this method is meant to be used with Function#bind() where `this` is bound to the stream to write to.
     *
     * @param {String} data the data to write
     */
    function writer(data) {
        if (!/^(\r\n|\n|\r)$/gm.test(data)) {
            this.write(data);
        }
    }

    grunt.registerMultiTask("vows", "Run vows tests.", function () {
        var done = this.async(),
            vows;

        helpers.setTarget(this.target);

        vows = require("child_process").exec(helpers.buildCommand());
        vows.stdout.on("data", writer.bind(process.stdout));
        vows.stderr.on("data", writer.bind(process.stderr));
        vows.on("exit", function (code) {
            done(code === 0);
        });
    });

};
