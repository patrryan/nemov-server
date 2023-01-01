import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamportService } from '../iamport/iamport.service';
import { User } from '../users/entities/user.entity';
import { Point } from './entities/point.entity';
import { PointsResolver } from './points.resolver';
import { PointsService } from './points.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Point, //
      User,
    ]),
  ],
  providers: [
    PointsResolver, //
    PointsService,
    IamportService,
  ],
})
export class PointsModule {}
