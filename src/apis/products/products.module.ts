import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../Images/entities/Image.entity';
import { Product } from './entities/product.entity';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product, //
      Image,
    ]),
  ],

  providers: [
    ProductsResolver, //
    ProductsService,
  ],
})
export class ProductsModule {}
