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
import { UpdateProductRequestDto } from './dto/update-product-request.dto';
import { UpdateProductResponseDto } from './dto/update-product-response.dto';

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
    this.validateHashid(productId);

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

  public async update(
    productId: string,
    product: UpdateProductRequestDto,
    user: LoggedInUserInterface,
  ): Promise<UpdateProductResponseDto> {
    const id: number = this.decodeHashid(productId);
    const updatedProduct: Product = await this.productRepository.save({
      id,
      name: product.name,
      price: product.price,
      photos: product.photos,
      thumbnail: product.thumbnail,
    });

    return new UpdateProductResponseDto(
      productId,
      updatedProduct.name,
      updatedProduct.price,
      updatedProduct.thumbnail,
      updatedProduct.photos,
    );
  }

  public async remove(productId: string): Promise<void> {
    this.validateHashid(productId);

    const id: number = this.decodeHashid(productId);

    const product: Product = await this.getById(id);

    await this.productRepository.remove(product);
  }

  private validateHashid(hashids: string): void {
    if (!this.hashids.isValidId(hashids)) {
      throw new HashidsNotValidException();
    }
  }

  private decodeHashid(productId: string): number {
    const id = this.hashids.decode(productId);
    if (id.length === 0) {
      throw new HashidsNotValidException();
    }

    return id[0] as number;
  }

  private async getById(id: number): Promise<Product> {
    if (!(await this.checkExistsById(id))) {
      throw new ProductNotFoundException();
    }

    return await this.productRepository.findOneBy({ id });
  }

  public async checkExistsById(id: number): Promise<boolean> {
    if (!id) {
      return false;
    }
    return this.productRepository.existsBy({ id });
  }
}
