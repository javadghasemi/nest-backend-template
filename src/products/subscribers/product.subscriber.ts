import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  LoadEvent,
} from 'typeorm';
import { Product } from '../entity/product.entity';
// @ts-ignore
import * as Hashids from 'hashids';
import { Inject } from '@nestjs/common';

@EventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface<Product> {
  constructor(
    dataSource: DataSource,
    @Inject('HASH_IDS') private hashids: Hashids,
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
