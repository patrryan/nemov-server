import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { CartResolver } from './cart.resolver';
import { CartService } from './cart.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product, //
    ]),
  ],
  providers: [
    CartResolver, //
    CartService,
  ],
})
export class CartModule {}
