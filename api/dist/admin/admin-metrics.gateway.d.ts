import { OnModuleDestroy } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import type { Server } from 'socket.io';
import type { Socket } from 'socket.io';
import { ActiveSessionsService } from '../auth/active-sessions.service';
import { AdminSocketAuthService } from './admin-socket-auth.service';
import { SystemMetricsService } from './system-metrics.service';
export declare class AdminMetricsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleDestroy {
    private readonly adminSocketAuth;
    private readonly systemMetrics;
    private readonly activeSessions;
    private readonly logger;
    private metricsInterval?;
    server: Server;
    constructor(adminSocketAuth: AdminSocketAuthService, systemMetrics: SystemMetricsService, activeSessions: ActiveSessionsService);
    afterInit(server: Server): void;
    onModuleDestroy(): void;
    private emitMetrics;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
}
