import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';

import {
  IAuthServiceGetAccessToken,
  IAuthServiceSetRefreshToken,
} from './interface/auth-service.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //
    private readonly adminService: AdminService,
  ) {}

  setRefreshToken({ user, res }: IAuthServiceSetRefreshToken): void {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.JWT_REFRESH_KEY, expiresIn: '1w' },
    );
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}`);
  }

  getAccessToken({ user }: IAuthServiceGetAccessToken): string {
    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.JWT_ACCESS_KEY, expiresIn: '1w' },
    );
  }

  async getTokenForAdmin({ email, password, res }) {
    const admin = await this.adminService.findOne({ email });
    if (!admin)
      throw new UnprocessableEntityException('이메일/비밀번호가 틀렸습니다.');

    const result = await bcrypt.compare(password, admin.password);
    if (!result)
      throw new UnprocessableEntityException('이메일/비밀번호가 틀렸습니다.');

    this.setRefreshToken1({ id: admin.id, res });

    return this.getAccessToken1({ id: admin.id });
  }

  setRefreshToken1({ id, res }): void {
    const refreshToken = this.jwtService.sign(
      { id },
      { secret: process.env.JWT_REFRESH_KEY, expiresIn: '1w' },
    );
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}`);
  }

  getAccessToken1({ id }): string {
    return this.jwtService.sign(
      { id },
      { secret: process.env.JWT_ACCESS_KEY, expiresIn: '1w' },
    );
  }
}
