"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma.service");
const active_sessions_service_1 = require("./active-sessions.service");
const uuidv7_util_1 = require("./uuidv7.util");
let AuthService = class AuthService {
    prisma;
    jwtService;
    activeSessions;
    constructor(prisma, jwtService, activeSessions) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.activeSessions = activeSessions;
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('E-mail ou senha incorretos');
        }
        const passwordOk = await bcrypt.compare(dto.password, user.password);
        if (!passwordOk) {
            throw new common_1.UnauthorizedException('E-mail ou senha incorretos');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };
        const jti = (0, uuidv7_util_1.generateUuidV7)();
        const clientType = dto.clientType ?? 'web';
        const access_token = await this.jwtService.signAsync(payload, {
            jwtid: jti,
        });
        const decoded = this.jwtService.decode(access_token);
        const jwtExpUnix = decoded?.exp;
        if (!jwtExpUnix) {
            throw new common_1.UnauthorizedException('Nao foi possivel criar sessao');
        }
        await this.activeSessions.registerSession(jti, jwtExpUnix, clientType);
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            access_token,
            jti,
            exp: jwtExpUnix,
            clientType,
        };
    }
    async removeSessionByJti(jti) {
        await this.activeSessions.removeSession(jti);
    }
    async parseTokenForSession(token, ignoreExpiration = false) {
        try {
            const payload = await this.jwtService.verifyAsync(token, { ignoreExpiration });
            if (!payload.jti || !payload.exp) {
                return null;
            }
            return { jti: payload.jti, exp: payload.exp };
        }
        catch {
            return null;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        active_sessions_service_1.ActiveSessionsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map