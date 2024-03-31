import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { Repository } from 'typeorm';
import { LoggedInUserInterface } from '../authentication/interfaces/logged-in-user.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}
  public create(product: CreateProductDto, user: LoggedInUserInterface) {
    console.log(product, user);
  }
}
