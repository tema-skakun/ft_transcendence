type DebugFunction = () => string[];
export declare class DebugService {
    private states;
    private kickoff;
    constructor();
    add(callback: DebugFunction): void;
}
export {};
