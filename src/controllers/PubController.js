import QueueServer from "../core/QueueServer";

export default function (router, queue: QueueServer) {
    router.post('/publish/:topic', async ctx => {
        queue.publish(ctx.params.topic, ctx.request.body);
        ctx.status = 200
    })
}