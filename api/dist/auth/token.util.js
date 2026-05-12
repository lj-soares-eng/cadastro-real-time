"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractAccessToken = extractAccessToken;
const auth_constants_1 = require("./auth.constants");
const cookie_util_1 = require("./cookie.util");
function parseBearerToken(rawAuthorization) {
    if (typeof rawAuthorization !== 'string') {
        return null;
    }
    const [scheme, token] = rawAuthorization.trim().split(/\s+/, 2);
    if (scheme?.toLowerCase() !== 'bearer' || !token) {
        return null;
    }
    return token;
}
function extractAccessToken(req) {
    const fromAuthorization = parseBearerToken(req.headers.authorization);
    if (fromAuthorization) {
        return fromAuthorization;
    }
    const cookieToken = req.cookies?.[auth_constants_1.AUTH_COOKIE_NAME];
    if (typeof cookieToken === 'string' && cookieToken.length > 0) {
        return cookieToken;
    }
    const cookieHeader = typeof req.headers.cookie === 'string' ? req.headers.cookie : undefined;
    return (0, cookie_util_1.parseCookieValue)(cookieHeader, auth_constants_1.AUTH_COOKIE_NAME);
}
//# sourceMappingURL=token.util.js.map