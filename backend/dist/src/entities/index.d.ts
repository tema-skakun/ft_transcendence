import { User } from "src/entities/user/user.entity";
import { Archivements } from "./archivements/archivments.entity";
import { Channel } from "./channel/channel.entity";
import { MatchHistoryEntry } from "./matchHistoryEntry/matchHistoryEntry.entity";
import { Message } from "./message/message.entity";
declare const entities: (typeof Archivements | typeof User | typeof Channel | typeof MatchHistoryEntry | typeof Message)[];
export { User };
export default entities;
