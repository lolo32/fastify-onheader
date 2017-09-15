"use strict";

const fastifyPlugin = require("fastify-plugin");
const onHeaders = require("on-headers");

/**
 * Decorators
 *
 * @param {fastify} instance
 * @param {function} instance.decorateReply
 * @param {Object} opts
 * @param {function} next
 */
module.exports = fastifyPlugin((instance, opts, next) => {

  instance.decorateReply("onheader",
      /**
       * Function called when new data should be send
       *
       * @param {function|Object.<string>} fn The function to be called, with this = ServerResponse, from NodeJS
       */
      function (fn) {
        onHeaders(this.res, fn);
      });

  next();
}, "0.x");
