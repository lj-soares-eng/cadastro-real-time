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
var ActiveSessionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveSessionsService = void 0;
const common_1 = require("@nestjs/common");
const net = __importStar(require("node:net"));
const ACTIVE_SESSIONS_KEY = 'active_sessions';
const WEB_SESSION_TTL_SECONDS = 60;
let ActiveSessionsService = ActiveSessionsService_1 = class ActiveSessionsService {
    logger = new common_1.Logger(ActiveSessionsService_1.name);
    redisConfig = this.parseRedisUrl();
    async registerSession(jti, jwtExpUnix, clientType) {
        const score = this.initialScore(clientType, jwtExpUnix);
        if (score <= this.unixNow()) {
            return;
        }
        await this.safeCommand(['ZADD', ACTIVE_SESSIONS_KEY, `${score}`, jti]);
    }
    async touchWebSession(jti, jwtExpUnix) {
        const now = this.unixNow();
        const nextScore = Math.min(now + WEB_SESSION_TTL_SECONDS, jwtExpUnix);
        if (nextScore <= now) {
            await this.removeSession(jti);
            return;
        }
        await this.safeCommand(['ZADD', ACTIVE_SESSIONS_KEY, `${nextScore}`, jti]);
    }
    async removeSession(jti) {
        await this.safeCommand(['ZREM', ACTIVE_SESSIONS_KEY, jti]);
    }
    async cleanupAndCountActiveSessions(now = this.unixNow()) {
        const script = "redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', ARGV[1]);" +
            "return redis.call('ZCARD', KEYS[1]);";
        const result = await this.safeCommand([
            'EVAL',
            script,
            '1',
            ACTIVE_SESSIONS_KEY,
            `${now}`,
        ]);
        if (typeof result === 'number') {
            return Math.max(0, result);
        }
        if (typeof result === 'string') {
            const asNumber = Number(result);
            return Number.isFinite(asNumber) ? Math.max(0, asNumber) : 0;
        }
        return 0;
    }
    initialScore(clientType, jwtExpUnix) {
        const now = this.unixNow();
        if (clientType === 'web') {
            return Math.min(now + WEB_SESSION_TTL_SECONDS, jwtExpUnix);
        }
        return jwtExpUnix;
    }
    unixNow() {
        return Math.floor(Date.now() / 1000);
    }
    parseRedisUrl() {
        const raw = process.env.REDIS_URL;
        if (!raw) {
            this.logger.warn('REDIS_URL nao definido, monitoramento ' +
                'de sessoes ativas desabilitado.');
            return null;
        }
        try {
            const parsed = new URL(raw);
            return {
                host: parsed.hostname || '127.0.0.1',
                port: parsed.port ? Number(parsed.port) : 6379,
                password: parsed.password || null,
                db: parsed.pathname ? Number(parsed.pathname.replace('/', '')) : null,
            };
        }
        catch (err) {
            this.logger.error(`REDIS_URL invalido: ${err instanceof Error ? err.message : err}`);
            return null;
        }
    }
    async safeCommand(args) {
        if (!this.redisConfig) {
            return null;
        }
        try {
            return await this.execRedisCommand(args);
        }
        catch (err) {
            this.logger.warn(`Falha no comando Redis ${args[0]}: ${err instanceof Error ? err.message : err}`);
            return null;
        }
    }
    execRedisCommand(args) {
        const cfg = this.redisConfig;
        if (!cfg) {
            return Promise.resolve(null);
        }
        const commandChain = [];
        if (cfg.password) {
            commandChain.push(['AUTH', cfg.password]);
        }
        if (cfg.db !== null && Number.isInteger(cfg.db) && cfg.db >= 0) {
            commandChain.push(['SELECT', `${cfg.db}`]);
        }
        commandChain.push(args);
        const payload = commandChain.map((cmd) => serializeRedisCommand(cmd)).join('');
        return new Promise((resolve, reject) => {
            const socket = net.createConnection({ host: cfg.host, port: cfg.port });
            const parser = new RedisReplyParser();
            let replies = [];
            socket.setTimeout(2000, () => {
                socket.destroy(new Error('Timeout na conexao Redis'));
            });
            socket.on('connect', () => {
                socket.write(payload);
            });
            socket.on('data', (chunk) => {
                try {
                    replies = replies.concat(parser.push(chunk.toString('utf8')));
                    if (replies.length >= commandChain.length) {
                        socket.end();
                    }
                }
                catch (err) {
                    socket.destroy(err);
                }
            });
            socket.on('error', (err) => {
                reject(err);
            });
            socket.on('close', (hadError) => {
                if (hadError) {
                    return;
                }
                if (replies.length < commandChain.length) {
                    reject(new Error('Resposta Redis incompleta'));
                    return;
                }
                for (let i = 0; i < commandChain.length - 1; i++) {
                    if (replies[i] !== 'OK') {
                        reject(new Error(`Redis handshake falhou em ${commandChain[i][0]}`));
                        return;
                    }
                }
                resolve(replies[replies.length - 1] ?? null);
            });
        });
    }
};
exports.ActiveSessionsService = ActiveSessionsService;
exports.ActiveSessionsService = ActiveSessionsService = ActiveSessionsService_1 = __decorate([
    (0, common_1.Injectable)()
], ActiveSessionsService);
function serializeRedisCommand(args) {
    const chunks = [`*${args.length}\r\n`];
    for (const arg of args) {
        chunks.push(`$${Buffer.byteLength(arg, 'utf8')}\r\n${arg}\r\n`);
    }
    return chunks.join('');
}
class RedisReplyParser {
    buffer = '';
    push(chunk) {
        this.buffer += chunk;
        const parsed = [];
        while (this.buffer.length > 0) {
            const prefix = this.buffer[0];
            const lineEnd = this.buffer.indexOf('\r\n');
            if (lineEnd === -1) {
                break;
            }
            if (prefix === '+' || prefix === '-' || prefix === ':') {
                const line = this.buffer.slice(1, lineEnd);
                this.buffer = this.buffer.slice(lineEnd + 2);
                if (prefix === '+') {
                    parsed.push(line);
                    continue;
                }
                if (prefix === ':') {
                    parsed.push(Number(line));
                    continue;
                }
                throw new Error(`Redis error reply: ${line}`);
            }
            if (prefix === '$') {
                const lenRaw = this.buffer.slice(1, lineEnd);
                const len = Number(lenRaw);
                if (!Number.isFinite(len)) {
                    throw new Error(`Bulk length invalido: ${lenRaw}`);
                }
                if (len === -1) {
                    this.buffer = this.buffer.slice(lineEnd + 2);
                    parsed.push(null);
                    continue;
                }
                const totalLen = lineEnd + 2 + len + 2;
                if (this.buffer.length < totalLen) {
                    break;
                }
                const start = lineEnd + 2;
                const body = this.buffer.slice(start, start + len);
                this.buffer = this.buffer.slice(totalLen);
                parsed.push(body);
                continue;
            }
            throw new Error(`Prefixo RESP nao suportado: ${prefix}`);
        }
        return parsed;
    }
}
//# sourceMappingURL=active-sessions.service.js.map