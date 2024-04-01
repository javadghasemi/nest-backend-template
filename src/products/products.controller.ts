import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
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
  @Get(':hashids')
  public async getOne(
    @Param('hashids') hashids: string,
  ): Promise<GetProductResponseDto> {
    return await this.productsService.getOne(hashids);
  }

  @Post()
  @UseGuards(AuthGuard)
  public create(
    @Body() product: CreateProductRequestDto,
    @User() user: LoggedInUserInterface,
  ): Promise<CreateProductResponseDto> {
    return this.productsService.create(product, user);
  }
}
