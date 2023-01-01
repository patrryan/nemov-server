import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //
  ) {}

  setRefreshToken({ id, res, req }): void {
    const refreshToken = this.jwtService.sign(
      { id },
      { secret: process.env.JWT_REFRESH_KEY, expiresIn: '1w' },
    );

    const allowedOrigins = [
      'http://localhost:3000',
      'https://code-backend.shop/graphql',
      'http://127.0.0.1:5500',
    ];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
    );
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; path=/; domain=.code-backend.shop; SameSite=None; Secure; httpOnly;`,
    );
    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}`);
  }

  getAccessToken({ id }): string {
    return this.jwtService.sign(
      { id },
      { secret: process.env.JWT_ACCESS_KEY, expiresIn: '1w' },
    );
  }
}
