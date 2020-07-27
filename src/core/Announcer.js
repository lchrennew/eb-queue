export default class Announcer {
    constructor(channel) {
        this.channel = channel
    }

    channel;

    announce = msg => this.channel.emit('msg', msg)
}