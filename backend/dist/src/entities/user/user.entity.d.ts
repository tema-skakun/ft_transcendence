import { Archivements } from "../archivements/archivments.entity";
import { Channel } from "../channel/channel.entity";
import { MatchHistoryEntry } from "../matchHistoryEntry/matchHistoryEntry.entity";
export declare class User {
    intra_id: number;
    created_at: Date;
    updated_at: Date;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    picture_url?: string;
    blockedBy?: User[];
    blockedUsers?: User[];
    ownedChannels?: Channel[];
    channels?: Channel[];
    administeredChannels?: Channel[];
    accessToken?: string;
    refreshToken?: string;
    twoFactorAuthenticationSecret?: string;
    isTwoFactorAuthenticationEnabled: boolean;
    wonGames: MatchHistoryEntry[];
    lostGames: MatchHistoryEntry[];
    total_wins: number;
    total_losses: number;
    archivements: Archivements[];
    friends: User[];
    socket_id?: string;
}
