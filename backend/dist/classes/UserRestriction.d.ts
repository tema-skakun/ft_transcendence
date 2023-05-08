type SwitchFunction = (newState: boolean, client: string, props?: any) => void;
export declare class UserRestriction {
    static user_can_press_keys_in_game_canvas: string;
    private restrictions;
    private nested;
    constructor();
    switch(on: boolean, userId: string, action: string, props?: any): void;
    attachStateSwitch(userId: string, action: string, stateSwitch: SwitchFunction, initalState?: boolean): void;
}
export {};
