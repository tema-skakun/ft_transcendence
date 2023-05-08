import { UserService } from '../user/user.service';
export declare class ArchivementsController {
    private usrService;
    constructor(usrService: UserService);
    test(): string;
    getArchivements(intraId: number): Promise<import("../../entities/archivements/archivments.entity").Archivements[]>;
}
