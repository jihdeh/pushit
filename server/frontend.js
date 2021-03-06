"use strict";
import serve from "koa-static";
import path from "path";
import koa from "koa";
import koaRouter from "koa-router";

export default function Frontend() {
  const server = koa();
  const router = koaRouter();

  return server
    .use(serve(path.join(__dirname, "../public")))
    .use(router.routes())
}
