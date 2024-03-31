import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateProductRequestDto } from './dto/create-product-request.dto';
import { ProductsService } from './products.service';
import { User } from '../authentication/decorator/user.decorator';
import { LoggedInUserInterface } from '../authentication/interfaces/logged-in-user.interface';
import { AuthGuard } from '../authentication/guards/auth.guard';
import { CreateProductResponseDto } from './dto/create-product-response.dto';
import { Product } from './entity/product.entity';

@Controller({
  path: 'products',
  version: '1',
})
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  public getAll(): Promise<Product[]> {
    return this.productsService.getAll();
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
