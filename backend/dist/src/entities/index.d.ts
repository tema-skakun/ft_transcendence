import { User } from "src/entities/user/user.entity";
import { Archivements } from "./archivements/archivments.entity";
import { MatchHistoryEntry } from "./matchHistoryEntry/matchHistoryEntry.entity";
declare const entities: (typeof Archivements | typeof User | typeof MatchHistoryEntry)[];
export { User };
export default entities;
