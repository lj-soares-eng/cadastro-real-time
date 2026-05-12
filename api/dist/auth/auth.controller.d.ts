import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
type AuthedRequest = Request & {
    user: {
        userId: number;
        email: string;
        name: string;
        role: import('@prisma/client').Role;
    };
};
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto, res: Response): Promise<{
        user: {
            id: number;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
        };
        access_token: string;
        tokenType: string;
        exp: number;
    } | {
        user: {
            id: number;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
        };
        access_token?: undefined;
        tokenType?: undefined;
        exp?: undefined;
    }>;
    logout(req: Request, res: Response): Promise<void>;
    endSessionFromBeacon(req: Request): Promise<void>;
    me(req: AuthedRequest): {
        id: number;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
    };
}
export {};
