export type AdminMetricsPayload = {
    timestamp: number;
    activeSessions: number;
    cpuPercent: number;
    memory: {
        heapUsed: number;
        heapTotal: number;
        rss: number;
        systemUsed: number;
        systemTotal: number;
    };
    network: {
        rxBytesPerSec: number;
        txBytesPerSec: number;
    } | null;
};
export declare class SystemMetricsService {
    private lastCpuUsage;
    private lastSampleAt;
    sample(activeSessions: number): Promise<AdminMetricsPayload>;
}
