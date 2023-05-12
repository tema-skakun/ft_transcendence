export declare class UserTransformed {
    intra_id: number;
    username: string;
    picture_url: string;
    created_at: Date;
    updated_at: Date;
    email: string;
    first_name: string;
    last_name: string;
    accessToken?: string;
    refreshToken?: string;
    twoFactorAuthenticationSecret?: string;
    isTwoFactorAuthenticationEnabled: boolean;
    total_wins: number;
    total_losses: number;
}
