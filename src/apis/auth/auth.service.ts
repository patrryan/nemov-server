import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //
  ) {}

  setRefreshToken({ id, res }): void {
    const refreshToken = this.jwtService.sign(
      { id },
      { secret: process.env.JWT_REFRESH_KEY, expiresIn: '1w' },
    );
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}`);
  }

  getAccessToken({ id }): string {
    return this.jwtService.sign(
      { id },
      { secret: process.env.JWT_ACCESS_KEY, expiresIn: '1w' },
    );
  }
}
