"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AdminMetricsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMetricsGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const active_sessions_service_1 = require("../auth/active-sessions.service");
const admin_socket_auth_service_1 = require("./admin-socket-auth.service");
const system_metrics_service_1 = require("./system-metrics.service");
const METRICS_INTERVAL_MS = 1000;
function adminCorsOrigin() {
    return process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';
}
let AdminMetricsGateway = AdminMetricsGateway_1 = class AdminMetricsGateway {
    adminSocketAuth;
    systemMetrics;
    activeSessions;
    logger = new common_1.Logger(AdminMetricsGateway_1.name);
    metricsInterval;
    server;
    constructor(adminSocketAuth, systemMetrics, activeSessions) {
        this.adminSocketAuth = adminSocketAuth;
        this.systemMetrics = systemMetrics;
        this.activeSessions = activeSessions;
    }
    afterInit(server) {
        this.metricsInterval = setInterval(() => {
            void this.emitMetrics(server);
        }, METRICS_INTERVAL_MS);
    }
    onModuleDestroy() {
        if (this.metricsInterval) {
            clearInterval(this.metricsInterval);
        }
    }
    async emitMetrics(server) {
        try {
            const activeSessionsCount = await this.activeSessions.cleanupAndCountActiveSessions();
            const payload = await this.systemMetrics.sample(activeSessionsCount);
            server.emit('metrics', payload);
        }
        catch (err) {
            this.logger.warn(`Falha ao emitir métricas: ${err instanceof Error ? err.message : err}`);
        }
    }
    async handleConnection(client) {
        const ok = await this.adminSocketAuth.verifyAdminSocket(client);
        if (!ok) {
            client.disconnect(true);
            return;
        }
        client.data.adminMetricsSession = true;
    }
    handleDisconnect(client) {
        if (client.data.adminMetricsSession) {
            client.data.adminMetricsSession = false;
        }
    }
};
exports.AdminMetricsGateway = AdminMetricsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Function)
], AdminMetricsGateway.prototype, "server", void 0);
exports.AdminMetricsGateway = AdminMetricsGateway = AdminMetricsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/admin',
        cors: {
            origin: adminCorsOrigin(),
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [admin_socket_auth_service_1.AdminSocketAuthService,
        system_metrics_service_1.SystemMetricsService,
        active_sessions_service_1.ActiveSessionsService])
], AdminMetricsGateway);
//# sourceMappingURL=admin-metrics.gateway.js.map