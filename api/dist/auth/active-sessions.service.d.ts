export type SessionClientType = 'web' | 'api';
export declare class ActiveSessionsService {
    private readonly logger;
    private readonly redisConfig;
    registerSession(jti: string, jwtExpUnix: number, clientType: SessionClientType): Promise<void>;
    touchWebSession(jti: string, jwtExpUnix: number): Promise<void>;
    removeSession(jti: string): Promise<void>;
    cleanupAndCountActiveSessions(now?: number): Promise<number>;
    private initialScore;
    private unixNow;
    private parseRedisUrl;
    private safeCommand;
    private execRedisCommand;
}
