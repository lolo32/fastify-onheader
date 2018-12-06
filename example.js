"use strict";

const fastify = require("fastify")();

fastify.register(require("./index"));
fastify.after((err) => {
  if (err) {
    throw err;
  }
});
const startTime = Symbol("startTime");

fastify.addHook('onRequest', (req, res, next) => {
  res[startTime] = Date.now();
  next();
});

fastify.get("/header", (request, reply) => {
  reply.onheader(function() {
    this.setHeader("X-Powered-By", "Fastify");
    this.setHeader("X-Duration-ms", Date.now() - reply.res[startTime]);
  });
  reply.send({hello: "world"});
});

fastify.get("/", (request, reply) => {
  reply.send({hello: "world"});
});

fastify.listen(3000, (err) => {
  if (err) {
    throw err;
  }
  console.log(`server listening on ${fastify.server.address().port}`);
});
