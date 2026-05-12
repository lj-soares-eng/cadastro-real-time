"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUuidV7 = generateUuidV7;
const node_crypto_1 = require("node:crypto");
function generateUuidV7(nowMs = Date.now()) {
    const bytes = (0, node_crypto_1.randomBytes)(16);
    const ts = BigInt(nowMs) & 0xffffffffffffn;
    bytes[0] = Number((ts >> 40n) & 0xffn);
    bytes[1] = Number((ts >> 32n) & 0xffn);
    bytes[2] = Number((ts >> 24n) & 0xffn);
    bytes[3] = Number((ts >> 16n) & 0xffn);
    bytes[4] = Number((ts >> 8n) & 0xffn);
    bytes[5] = Number(ts & 0xffn);
    bytes[6] = (bytes[6] & 0x0f) | 0x70;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Buffer.from(bytes).toString('hex');
    return [
        hex.slice(0, 8),
        hex.slice(8, 12),
        hex.slice(12, 16),
        hex.slice(16, 20),
        hex.slice(20, 32),
    ].join('-');
}
//# sourceMappingURL=uuidv7.util.js.map