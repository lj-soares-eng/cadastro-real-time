import { Role } from '@prisma/client';
import { Strategy } from 'passport-jwt';
export type AccessTokenPayload = {
    sub: number;
    email: string;
    name: string;
    role?: Role;
    jti?: string;
    exp?: number;
};
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: AccessTokenPayload): {
        userId: number;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        jti: string | undefined;
        exp: number | undefined;
    };
}
export {};
