import { StatusService } from './status.service';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
export declare class StatusController {
    private statusService;
    private userRep;
    constructor(statusService: StatusService, userRep: Repository<User>);
    getStatus(req: any): Promise<Object>;
}
