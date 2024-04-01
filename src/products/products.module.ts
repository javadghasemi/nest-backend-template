import { DynamicModule, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { UsersModule } from '../users/users.module';
import Hashids from 'hashids';
import { ProductSubscriber } from './subscriber/product.subscriber';
import { HASH_IDS_TOKEN } from './constants';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), UsersModule],
  providers: [ProductsService, ProductSubscriber],
  controllers: [ProductsController],
})
export class ProductsModule {
  static register(options: {
    hashids: { salt: string; minLength: number };
  }): DynamicModule {
    return {
      module: ProductsModule,
      imports: [TypeOrmModule.forFeature([Product]), UsersModule],
      providers: [
        ProductsService,
        ProductSubscriber,
        {
          provide: HASH_IDS_TOKEN,
          useFactory: () =>
            new Hashids(options.hashids.salt, options.hashids.minLength),
        },
      ],
      controllers: [ProductsController],
    };
  }
}
