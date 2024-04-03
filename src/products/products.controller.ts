import {
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateProductRequestDto } from './dto/create-product-request.dto';
import { ProductsService } from './products.service';
import { User } from '../authentication/decorator/user.decorator';
import { LoggedInUserInterface } from '../authentication/interfaces/logged-in-user.interface';
import { AuthGuard } from '../authentication/guards/auth.guard';
import { CreateProductResponseDto } from './dto/create-product-response.dto';
import { Product } from './entity/product.entity';
import { GetProductResponseDto } from './dto/get-product-response.dto';
import { HashidsNotValidException } from './exception/hashids-not-valid.exception';
import { ProductNotFoundException } from './exception/product-not-found.exception';

@Controller({
  path: 'products',
  version: '1',
})
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  public getAll(): Promise<Product[]> {
    return this.productsService.getAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':productId')
  public async getOne(
    @Param('productId') productId: string,
  ): Promise<GetProductResponseDto> {
    try {
      return await this.productsService.getOne(productId);
    } catch (e) {
      if (e instanceof HashidsNotValidException) {
        throw new ConflictException(e.message);
      } else if (e instanceof ProductNotFoundException) {
        throw new NotFoundException(e.message);
      }

      throw new InternalServerErrorException();
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseGuards(AuthGuard)
  public create(
    @Body() product: CreateProductRequestDto,
    @User() user: LoggedInUserInterface,
  ): Promise<CreateProductResponseDto> {
    return this.productsService.create(product, user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':productId')
  @UseGuards(AuthGuard)
  public remove(@Param('productId') productId: string): Promise<void> {
    return this.productsService.remove(productId);
  }
}
