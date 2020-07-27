import sock from "sockjs";
import Announcer from "./Announcer";
import MultiplexServer from "./MultiplexServer";
import Peer from "./Peer";

export default class QueueServer {

    ws;
    multiplexer;
    channels = {};

    start(server) {
        this.ws = sock.createServer({disconnect_delay: 10});
        this.multiplexer = new MultiplexServer(this.ws);
        this.ws.installHandlers(server, {prefix: '/queues'});
        this.ws.on('requireChannel', (topic, conn) => this.getChannel(topic).emit('connection', conn))
    }

    getChannel(topic) {
        let channel = this.channels[topic];
        if (!(topic in this.channels)) {
            channel = this.multiplexer.registerChannel(topic)
                .on('connection', connection => new Peer(channel, connection).connect());
            this.channels[topic] = channel;
        }
        return channel
    }

    publish(topic, msg) {
        new Announcer(this.getChannel(topic)).announce(msg);
    }

}