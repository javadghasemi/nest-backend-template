import { Injectable } from '@nestjs/common';
import { CreateProductRequestDto } from './dto/create-product-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { Repository } from 'typeorm';
import { LoggedInUserInterface } from '../authentication/interfaces/logged-in-user.interface';
// @ts-ignore
import * as Hashids from 'hashids';
import { UsersService } from '../users/users.service';
import { User } from '../users/entity/user.entity';
import { CreateProductResponseDto } from './dto/create-product-response.dto';

@Injectable()
export class ProductsService {
  private hashids: Hashids;
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private usersService: UsersService,
  ) {
    this.hashids = new Hashids('', 5);
  }
  public async create(
    product: CreateProductRequestDto,
    user: LoggedInUserInterface,
  ) {
    const productCreator: User = await this.usersService.getById(user.sub);
    const savedProduct = new Product(
      product.name,
      product.price,
      product.thumbnail,
      product.photos,
      productCreator,
    );

    const createdProduct: Product =
      await this.productRepository.save(savedProduct);

    return new CreateProductResponseDto(
      this.hashids.encode(createdProduct.id),
      createdProduct.name,
      createdProduct.price,
      createdProduct.thumbnail,
      createdProduct.photos,
    );
  }
}
