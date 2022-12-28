import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import { Admin } from '../admin/entities/admin.entity';

@Module({
  imports: [
    JwtModule.register({}), //
    TypeOrmModule.forFeature([
      User, //
      Admin,
    ]),
  ],
  providers: [
    AuthResolver, //
    AuthService,
    UsersService,
    AdminService,
  ],
})
export class AuthModule {}
