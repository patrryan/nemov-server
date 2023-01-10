import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from '../cart/cart.service';
import { Point } from '../points/entities/point.entity';
import { Product } from '../products/entities/product.entity';
import { ReviewImage } from '../reviewImages/entities/reviewImage.entity';
import { Review } from '../reviews/entities/review.entity';
import { ReviewsService } from '../reviews/reviews.service';
import { User } from '../users/entities/user.entity';
import { ProductOrder } from './entities/productOrder.entity';
import { ProductsOrdersResolver } from './productsOrders.resolver';
import { ProductsOrdersService } from './productsOrders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductOrder, //
      Product,
      User,
      Point,
      Review,
      ReviewImage,
    ]),
  ],
  providers: [
    ProductsOrdersResolver, //
    ProductsOrdersService,
    CartService,
    ReviewsService,
  ],
})
export class ProductsOrdersModule {}
