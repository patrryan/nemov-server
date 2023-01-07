import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from '../productsCategories/entities/productCategory.entity';
import { ProductOption } from '../productsOptions/entities/productOption.entity';
import { User } from '../users/entities/user.entity';
import { Product } from './entities/product.entity';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product, //
      User,
      ProductCategory,
      ProductOption,
    ]),
  ],

  providers: [
    ProductsResolver, //
    ProductsService,
  ],
})
export class ProductsModule {}
