"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authCookieBase = exports.jwtSecret = exports.AUTH_COOKIE_NAME = void 0;
exports.AUTH_COOKIE_NAME = 'access_token';
exports.jwtSecret = process.env.JWT_SECRET ?? 'dev-secret-change-in-production';
exports.authCookieBase = {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
};
//# sourceMappingURL=auth.constants.js.map