import { JwtService } from '@nestjs/jwt';
import type { Socket } from 'socket.io';
export declare class AdminSocketAuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    verifyAdminSocket(client: Socket): Promise<boolean>;
}
