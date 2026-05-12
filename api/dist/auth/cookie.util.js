"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCookieValue = parseCookieValue;
function parseCookieValue(cookieHeader, name) {
    if (!cookieHeader || typeof cookieHeader !== 'string') {
        return null;
    }
    const segments = cookieHeader.split(';');
    for (const segment of segments) {
        const trimmed = segment.trim();
        const eq = trimmed.indexOf('=');
        if (eq === -1) {
            continue;
        }
        const key = trimmed.slice(0, eq).trim();
        if (key !== name) {
            continue;
        }
        const raw = trimmed.slice(eq + 1).trim();
        try {
            return decodeURIComponent(raw);
        }
        catch {
            return raw.length > 0 ? raw : null;
        }
    }
    return null;
}
//# sourceMappingURL=cookie.util.js.map