import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtSecret } from '../auth.constants';
import { extractAccessToken } from '../token.util';
import { PrismaService } from '../../prisma.service';

/* Tipo de dado para o payload do token de acesso */
export type AccessTokenPayload = {
  sub: number;
  email: string;
  name: string;
  role?: Role;
  jti?: string;
  exp?: number;
};

/* Estrategia de autenticacao JWT */
@Injectable()
/* Estrategia de autenticacao JWT */
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly prisma: PrismaService) {
    /* Configura a estrategia */
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => extractAccessToken(req),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  /* Funcao para validar o payload do token de acesso */
  async validate(payload: AccessTokenPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role ?? payload.role ?? Role.USER,
      jti: payload.jti,
      exp: payload.exp,
    };
  }
}
