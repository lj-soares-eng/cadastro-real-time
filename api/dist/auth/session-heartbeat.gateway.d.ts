import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import type { Socket } from 'socket.io';
import { ActiveSessionsService } from './active-sessions.service';
export declare class SessionHeartbeatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    private readonly activeSessions;
    private readonly logger;
    constructor(jwtService: JwtService, activeSessions: ActiveSessionsService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(_client: Socket): void;
    onHeartbeat(client: Socket): Promise<void>;
    private extractSocketToken;
    private verifySocketSession;
}
