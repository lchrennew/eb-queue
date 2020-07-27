import Announcer from "./Announcer";

export default class Peer {
    constructor(channel, connection) {
        this.channel = channel;
        this.connection = connection;
        this.announcer = new Announcer(channel);
    }

    connection;
    channel;
    announcer;

    connect = () => {
        this.connection
            .on('close', this.close)
            .on('data', this.announce);
        this.channel.on('msg', this.remember)
    };

    close = () => {
        this.channel.off('msg', this.remember);
        this.connection.destroy()
    };

    remember = msg => this.connection.write(JSON.stringify({msg, t: new Date().valueOf()}));

    announce = msg => this.announcer.announce(msg)
}