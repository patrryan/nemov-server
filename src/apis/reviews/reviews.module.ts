import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrder } from '../productsOrders/entities/productOrder.entity';
import { ReviewImage } from '../reviewImages/entities/reviewImage.entity';
import { Review } from './entities/review.entity';
import { ReviewResolver } from './reviews.resolver';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review, //
      ReviewImage,
      ProductOrder,
    ]),
  ],
  providers: [
    ReviewResolver, //
    ReviewsService,
  ],
})
export class ReviewsModule {}
