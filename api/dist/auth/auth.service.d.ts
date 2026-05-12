import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { ActiveSessionsService, SessionClientType } from './active-sessions.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly activeSessions;
    constructor(prisma: PrismaService, jwtService: JwtService, activeSessions: ActiveSessionsService);
    login(dto: LoginDto): Promise<{
        user: {
            id: number;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
        };
        access_token: string;
        jti: string;
        exp: number;
        clientType: SessionClientType;
    }>;
    removeSessionByJti(jti: string): Promise<void>;
    parseTokenForSession(token: string, ignoreExpiration?: boolean): Promise<{
        jti: string;
        exp: number;
    } | null>;
}
