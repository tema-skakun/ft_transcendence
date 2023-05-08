import { UserService } from '../user/user.service';
import { Archivements, archivement_vals } from 'src/entities/archivements/archivments.entity';
import { Repository } from 'typeorm';
export declare class ArchivementsService {
    private rep;
    private usrService;
    constructor(rep: Repository<Archivements>, usrService: UserService);
    addArchivement(type: archivement_vals, intraId: number): Promise<void>;
}
