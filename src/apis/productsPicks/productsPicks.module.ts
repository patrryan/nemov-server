import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { ProductPick } from './entities/productPick.entity';
import { ProductsPicksResolver } from './productsPicks.resolver';
import { ProductsPicksService } from './productsPicks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductPick, //
      Product,
    ]),
  ],
  providers: [
    ProductsPicksResolver, //
    ProductsPicksService,
  ],
})
export class ProductsPicksModule {}
