import { Socket } from "socket.io";
import { Client } from "src/classes/client";
export declare function spawnY(): number;
export declare function socketToCookie(socket: Socket): string;
export declare function roomToSocket(namespace: any, room: string): Promise<Set<string>>;
export declare function setOtherPlayer(client: Client, clients: Map<string, Client>): Promise<void>;
