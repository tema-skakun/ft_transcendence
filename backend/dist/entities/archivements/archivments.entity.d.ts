import { User } from "../user/user.entity";
export declare enum archivement_vals {
    triggered = 0,
    chad = 1
}
export declare class Archivements {
    id: number;
    holder: User;
    type: archivement_vals;
}
