import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
} from 'typeorm';
import { Product } from '../entity/product.entity';
import Hashids from 'hashids';
import { Inject } from '@nestjs/common';
import { HASH_IDS_TOKEN } from '../constants';

@EventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface<Product> {
  constructor(
    dataSource: DataSource,
    @Inject(HASH_IDS_TOKEN) private hashids: Hashids,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Product;
  }

  afterLoad(entity: Product): Promise<any> | void {
    entity.productId = this.hashids.encode(entity.id);
  }
}
