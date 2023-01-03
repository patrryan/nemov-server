import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './apis/users/users.module';
import { JwtAccessStrategy } from './commons/auth/jwt-access.strategy';
import { JwtRefreshStrategy } from './commons/auth/jwt-refresh.strategy';
import { AuthModule } from './apis/auth/auth.module';
import { FilesModule } from './apis/files/file.module';
import { ProductsModule } from './apis/products/products.module';
import { customTypes } from './commons/graphql/customTypes/customTypes';
import { PhoneModule } from './apis/phone/phone.module';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { ReviewsModule } from './apis/reviews/reviews.module';
import { QuestionsModule } from './apis/questions/questions.module';
import { PointsModule } from './apis/points/points.module';
import { CartModule } from './apis/cart/cart.module';
import { ProductsPicksModule } from './apis/productsPicks/productsPicks.module';
import { ProductsOrdersModule } from './apis/productsOrders/productsOrders.module';
import { AnswersModule } from './apis/answer/answer.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      resolvers: [...customTypes],
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'reids://my-redis:6379',
      isGlobal: true,
    }),
    FilesModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    PhoneModule,
    ReviewsModule,
    QuestionsModule,
    PointsModule,
    CartModule,
    ProductsPicksModule,
    ProductsOrdersModule,
    AnswersModule,
  ],
  providers: [
    AppService, //
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
  controllers: [
    AppController, //
  ],
})
export class AppModule {}
