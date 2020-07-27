import {EventEmitter} from "events";
import Channel from "./Channel";

export default class MultiplexServer {
    constructor(service: EventEmitter) {
        this.service = service;
        const multiplex = {
            "uns": (channels, topic, sub) => {
                delete channels[topic];
                sub.emit('close')
            },
            "msg": (channels, topic, sub, payload) => sub.emit('data', payload),
            "sub": (channels, topic, sub) => {
                if (!(topic in this.registered_channels)) {
                    this.service.emit('requireChannel', topic, sub)
                } else {
                    this.registered_channels[topic].emit('connection', sub)
                }
            },
        };
        service.on('connection', conn => {
            let channels = {};

            conn.on('data', message => {
                let t = message.split(',');
                let type = t.shift(), topic = t.shift(), payload = t.join();
                const proc = multiplex[type];
                if (proc) {
                    let sub = channels[topic] ?? (channels[topic] = new Channel(conn, topic, channels));
                    proc(channels, topic, sub, payload);

                }
            });
            conn.on('close', () => {
                for (const topic in channels) {
                    channels[topic].emit('close');
                }
                channels = {};
            });
        })
    }

    registered_channels = {};
    service: EventEmitter;

    registerChannel = name => this.registered_channels[escape(name)] = new EventEmitter();
}