export declare const AUTH_COOKIE_NAME = "access_token";
export declare const jwtSecret: string;
export declare const authCookieBase: {
    httpOnly: boolean;
    sameSite: "lax";
    path: string;
};
