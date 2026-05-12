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
var SessionHeartbeatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionHeartbeatGateway = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const websockets_1 = require("@nestjs/websockets");
const auth_constants_1 = require("./auth.constants");
const cookie_util_1 = require("./cookie.util");
const active_sessions_service_1 = require("./active-sessions.service");
function sessionCorsOrigin() {
    return process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';
}
let SessionHeartbeatGateway = SessionHeartbeatGateway_1 = class SessionHeartbeatGateway {
    jwtService;
    activeSessions;
    logger = new common_1.Logger(SessionHeartbeatGateway_1.name);
    constructor(jwtService, activeSessions) {
        this.jwtService = jwtService;
        this.activeSessions = activeSessions;
    }
    async handleConnection(client) {
        const token = this.extractSocketToken(client);
        if (!token) {
            client.disconnect(true);
            return;
        }
        const session = await this.verifySocketSession(token);
        if (!session) {
            client.disconnect(true);
            return;
        }
        client.data.sessionJti = session.jti;
        client.data.sessionExp = session.exp;
        await this.activeSessions.touchWebSession(session.jti, session.exp);
    }
    handleDisconnect(_client) {
    }
    async onHeartbeat(client) {
        const jti = client.data.sessionJti;
        const exp = client.data.sessionExp;
        if (!jti || !exp) {
            client.disconnect(true);
            return;
        }
        await this.activeSessions.touchWebSession(jti, exp);
    }
    extractSocketToken(client) {
        const cookieHeader = client.handshake.headers.cookie;
        return (0, cookie_util_1.parseCookieValue)(cookieHeader, auth_constants_1.AUTH_COOKIE_NAME);
    }
    async verifySocketSession(token) {
        try {
            const payload = await this.jwtService.verifyAsync(token);
            if (!payload.jti || !payload.exp) {
                return null;
            }
            return { jti: payload.jti, exp: payload.exp };
        }
        catch (err) {
            this.logger.debug(`Token WS invalido: ${err instanceof Error ? err.message : err}`);
            return null;
        }
    }
};
exports.SessionHeartbeatGateway = SessionHeartbeatGateway;
__decorate([
    (0, websockets_1.SubscribeMessage)('session:heartbeat'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], SessionHeartbeatGateway.prototype, "onHeartbeat", null);
exports.SessionHeartbeatGateway = SessionHeartbeatGateway = SessionHeartbeatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/session',
        cors: {
            origin: sessionCorsOrigin(),
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        active_sessions_service_1.ActiveSessionsService])
], SessionHeartbeatGateway);
//# sourceMappingURL=session-heartbeat.gateway.js.map