import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './apis/users/users.module';
import { JwtAccessStrategy } from './commons/auth/jwt-access-strategy';
import { JwtRefreshStrategy } from './commons/auth/jwt-refresh.strategy';
import { AuthModule } from './apis/auth/auth.module';
import { FilesModule } from './apis/files/file.module';
import { AdminModule } from './apis/admin/admin.module';
import { JwtAdminAccessStrategy } from './commons/auth/jwt-admin-access-strategy';
import { ProductsModule } from './apis/products/products.module';
import { PhoneModule } from './apis/phone/phone.module';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
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
      // retryAttempts: 30,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'reids://my-redis:6379',
      isGlobal: true,
    }),
    FilesModule,
    AdminModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    PhoneModule,
  ],
  providers: [
    AppService, //
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtAdminAccessStrategy,
  ],
  controllers: [
    AppController, //
  ],
})
export class AppModule {}
