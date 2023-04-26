import { User } from "src/entities/user/user.entity";
import { Archivements } from "./archivements/archivments.entity";
import { MatchHistoryEntry } from "./matchHistoryEntry/matchHistoryEntry.entity";

const entities = [User, MatchHistoryEntry, Archivements];

export {User};
export default entities;