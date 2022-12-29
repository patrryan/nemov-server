import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { PhoneResolver } from './phone.resolver';
import { PhoneService } from './phone.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), //
    CacheModule.register({
      ttl: 300,
      max: 100,
    }),
  ],
  providers: [
    PhoneResolver, //
    PhoneService,
    UsersService,
  ],
})
export class PhoneModule {}
