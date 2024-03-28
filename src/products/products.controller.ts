import { Body, Controller, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/CreateProduct.dto';
import { ProductsService } from './products.service';

@Controller({
  path: 'products',
  version: '1',
})
export class ProductsController {
  constructor(private productsService: ProductsService) {}
  @Post()
  public create(@Body() product: CreateProductDto) {
    return this.productsService.create();
  }
}
