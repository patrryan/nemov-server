import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Product } from './entities/product.entity';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product, //
      User,
    ]),
  ],

  providers: [
    ProductsResolver, //
    ProductsService,
  ],
})
export class ProductsModule {}
