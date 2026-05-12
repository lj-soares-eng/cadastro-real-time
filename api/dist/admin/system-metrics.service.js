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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemMetricsService = void 0;
const common_1 = require("@nestjs/common");
const os = __importStar(require("os"));
const si = __importStar(require("systeminformation"));
let SystemMetricsService = class SystemMetricsService {
    lastCpuUsage = process.cpuUsage();
    lastSampleAt = Date.now();
    async sample(activeSessions) {
        const now = Date.now();
        const dtSec = Math.max((now - this.lastSampleAt) / 1000, 0.001);
        const cpuDelta = process.cpuUsage(this.lastCpuUsage);
        const cpuUserSec = cpuDelta.user / 1e6;
        const cpuSysSec = cpuDelta.system / 1e6;
        const cpuBusySec = cpuUserSec + cpuSysSec;
        const cpus = Math.max(1, os.cpus().length);
        const cpuPercent = Math.min(100, (cpuBusySec / dtSec / cpus) * 100);
        this.lastCpuUsage = process.cpuUsage();
        this.lastSampleAt = now;
        const pm = process.memoryUsage();
        const systemTotal = os.totalmem();
        const systemUsed = systemTotal - os.freemem();
        let network = null;
        try {
            const stats = await si.networkStats();
            let rxBytesPerSec = 0;
            let txBytesPerSec = 0;
            for (const row of stats) {
                rxBytesPerSec += row.rx_sec ?? 0;
                txBytesPerSec += row.tx_sec ?? 0;
            }
            network = {
                rxBytesPerSec: Math.max(0, rxBytesPerSec),
                txBytesPerSec: Math.max(0, txBytesPerSec),
            };
        }
        catch {
            network = null;
        }
        return {
            timestamp: now,
            activeSessions,
            cpuPercent,
            memory: {
                heapUsed: pm.heapUsed,
                heapTotal: pm.heapTotal,
                rss: pm.rss,
                systemUsed,
                systemTotal,
            },
            network,
        };
    }
};
exports.SystemMetricsService = SystemMetricsService;
exports.SystemMetricsService = SystemMetricsService = __decorate([
    (0, common_1.Injectable)()
], SystemMetricsService);
//# sourceMappingURL=system-metrics.service.js.map