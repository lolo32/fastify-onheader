/* eslint-disable no-confusing-arrow */

"use strict";

const fastifyOnHeader = require("./index");

const fastifyModule = require("fastify");
const test = require("tap").test;
const request = require("request");
const ServerResponse = require("http").ServerResponse;

test("reply.onheader exists", (tap) => {
  tap.plan(7);

  const data = {hello: "world"};

  const fastify = fastifyModule();
  fastify.register(fastifyOnHeader);
  fastify.ready((err) => {
    tap.error(err);
  });

  fastify.get("/", (request, reply) => {
    tap.ok(reply.onheader);
    reply.send(data);
  });

  fastify.listen(0, (err) => {
    tap.error(err);

    request({
      method: "GET",
      uri: `http://localhost:${fastify.server.address().port}`
    }, (err, response, body) => {
      tap.error(err);
      tap.strictEqual(response.statusCode, 200);
      tap.strictEqual(response.headers["content-length"], `${body.length}`);
      tap.deepEqual(JSON.parse(body), data);
      fastify.close();
    });
  });
});

test("reply.onheader can add headers", (tap) => {
  tap.plan(8);

  const data = {hello: "world"};

  const fastify = fastifyModule();
  fastify.register(fastifyOnHeader);
  fastify.ready((err) => {
    tap.error(err);
  });

  fastify.get("/", (request, reply) => {
    reply.onheader(function () {
      tap.ok(this instanceof ServerResponse);
      this.setHeader("X-OnHeader-Test", "Passed");
    });
    reply.send(data);
  });

  fastify.listen(0, (err) => {
    tap.error(err);

    request({
      method: "GET",
      uri: `http://localhost:${fastify.server.address().port}`
    }, (err, response, body) => {
      tap.error(err);
      tap.strictEqual(response.statusCode, 200);
      tap.strictEqual(response.headers["content-length"], `${body.length}`);
      tap.strictEqual(response.headers["x-onheader-test"], "Passed");
      tap.same(JSON.parse(body), data);
      fastify.close();
    });
  });
});
