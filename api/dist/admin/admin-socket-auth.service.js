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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSocketAuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const auth_constants_1 = require("../auth/auth.constants");
const cookie_util_1 = require("../auth/cookie.util");
let AdminSocketAuthService = class AdminSocketAuthService {
    jwtService;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async verifyAdminSocket(client) {
        const token = (0, cookie_util_1.parseCookieValue)(client.handshake.headers.cookie, auth_constants_1.AUTH_COOKIE_NAME);
        if (!token) {
            return false;
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, { secret: auth_constants_1.jwtSecret });
            const role = payload.role ?? client_1.Role.USER;
            if (role !== client_1.Role.ADMIN) {
                return false;
            }
            client.data.user = {
                userId: payload.sub,
                email: payload.email,
                name: payload.name,
                role,
            };
            return true;
        }
        catch {
            return false;
        }
    }
};
exports.AdminSocketAuthService = AdminSocketAuthService;
exports.AdminSocketAuthService = AdminSocketAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AdminSocketAuthService);
//# sourceMappingURL=admin-socket-auth.service.js.map