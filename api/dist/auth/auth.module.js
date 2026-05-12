"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const auth_constants_1 = require("./auth.constants");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const active_sessions_service_1 = require("./active-sessions.service");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const session_heartbeat_gateway_1 = require("./session-heartbeat.gateway");
const ws_jwt_auth_guard_1 = require("./guards/ws-jwt-auth.guard");
const ws_roles_guard_1 = require("./guards/ws-roles.guard");
const roles_guard_1 = require("./roles.guard");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: auth_constants_1.jwtSecret,
                signOptions: { expiresIn: '20min' },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            active_sessions_service_1.ActiveSessionsService,
            jwt_strategy_1.JwtStrategy,
            jwt_auth_guard_1.JwtAuthGuard,
            roles_guard_1.RolesGuard,
            ws_jwt_auth_guard_1.WsJwtAuthGuard,
            ws_roles_guard_1.WsRolesGuard,
            session_heartbeat_gateway_1.SessionHeartbeatGateway,
        ],
        exports: [
            active_sessions_service_1.ActiveSessionsService,
            jwt_auth_guard_1.JwtAuthGuard,
            jwt_1.JwtModule,
            roles_guard_1.RolesGuard,
            ws_jwt_auth_guard_1.WsJwtAuthGuard,
            ws_roles_guard_1.WsRolesGuard,
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map