import { Inject, Injectable } from '@nestjs/common';
import { CreateProductRequestDto } from './dto/create-product-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { Repository } from 'typeorm';
import { LoggedInUserInterface } from '../authentication/interfaces/logged-in-user.interface';
import Hashids from 'hashids';
import { UsersService } from '../users/users.service';
import { User } from '../users/entity/user.entity';
import { CreateProductResponseDto } from './dto/create-product-response.dto';
import { GetProductResponseDto } from './dto/get-product-response.dto';
import { HashidsNotValidException } from './exception/hashids-not-valid.exception';
import { ProductNotFoundException } from './exception/product-not-found.exception';
import { HASH_IDS_TOKEN } from './constants';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private usersService: UsersService,
    @Inject(HASH_IDS_TOKEN) private hashids: Hashids,
  ) {}

  public getAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['createdBy'],
      select: {
        createdBy: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    });
  }

  public async getOne(productId: string): Promise<GetProductResponseDto> {
    this.validateHashids(productId);

    const primaryId: number = this.hashids.decode(productId)[0] as number;

    const product: Product = await this.getById(primaryId);

    return new GetProductResponseDto(
      productId,
      product.name,
      product.price,
      product.thumbnail,
      product.photos,
    );
  }

  public async create(
    product: CreateProductRequestDto,
    user: LoggedInUserInterface,
  ): Promise<CreateProductResponseDto> {
    const productCreator: User = await this.usersService.getById(user.sub);
    const savedProduct: Product = new Product(
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

  private validateHashids(hashids: string): void {
    if (!this.hashids.isValidId(hashids)) {
      throw new HashidsNotValidException();
    }
  }

  private async getById(id: number): Promise<Product> {
    try {
      return await this.productRepository.findOneBy({ id });
    } catch (e) {
      throw new ProductNotFoundException();
    }
  }
}
