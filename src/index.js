import http from "http";
import Koa from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import Router from '@koa/router'
import PubController from "./controllers/PubController";
import QueueServer from "./core";

const app = new Koa();
const port = 9999;
const router = new Router();
const queue = new QueueServer();
PubController(router, queue);

app
    .use(cors({credentials: 'include'}))
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

const server = http.createServer(app.callback());
queue.start(server);
server.listen(port, '0.0.0.0');
console.log(`started listening on ${port}`);
