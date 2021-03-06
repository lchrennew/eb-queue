import {Stream} from "stream";

export default class Channel extends Stream {
    constructor(conn, topic, channels) {
        super();
        this.conn = conn;
        this.topic = topic;
        this.channels = channels;
    }

    write = data => this.conn.write('msg,' + this.topic + ',' + data);
    end = data => {
        if (data) this.write(data);
        if (this.topic in this.channels) {
            this.conn.write('uns,' + this.topic);
            delete this.channels[this.topic];
            process.nextTick(() => this.emit('close'));
        }
    };
    destroy = () => {
        this.removeAllListeners();
        this.end();
    };
    destroySoon = this.destroy;

    conn;
    topic;
    channels;
}