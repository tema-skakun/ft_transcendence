"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setOtherPlayer = exports.roomToSocket = exports.socketToCookie = exports.spawnY = void 0;
const constants_1 = require("../constants/constants");
const mathjs_1 = require("mathjs");
function spawnY() {
    return (0, mathjs_1.random)(constants_1.default.SPAWN_EXCLUSION, constants_1.default.HEIGHT - constants_1.default.SPAWN_EXCLUSION);
}
exports.spawnY = spawnY;
function socketToCookie(socket) {
    if (!socket.handshake.headers.cookie)
        throw Error('no cookie was set');
    return (socket.handshake.headers.cookie);
}
exports.socketToCookie = socketToCookie;
async function roomToSocket(namespace, room) {
    return await namespace.adapter.sockets(new Set([room]));
}
exports.roomToSocket = roomToSocket;
async function setOtherPlayer(client, clients) {
    console.log(`client.nsp: ${client.nsp}, client.pendingMatchRequest: ${client.pendingMatchRequest}`);
    const socketIdsInRoom = await roomToSocket(client.nsp, client.pendingMatchRequest);
    const dummy = new Map();
    socketIdsInRoom.forEach((socketId) => {
        console.log(`Clients size: ${clients.size}`);
        clients.forEach((cl) => {
            console.log(`This should the other players socket.id: ${socketId}`);
            console.log(`This is the other players socket.id: ${cl.id}`);
            console.log(`This is the player twos socket.id: ${client.id}`);
            if (cl.id === socketId && client.id !== socketId) {
                client.otherPlayerObj = cl;
            }
        });
    });
}
exports.setOtherPlayer = setOtherPlayer;
//# sourceMappingURL=trivial.js.map