import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../Images/entities/Image.entity';
import { User } from '../users/entities/user.entity';
import { Review } from './entities/review.entity';
import { ReviewResolver } from './reviews.resolver';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review, //
      User,
      Image,
    ]),
  ],
  providers: [
    ReviewResolver, //
    ReviewsService,
  ],
})
export class ReviewsModule {}
