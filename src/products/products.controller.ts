import { Body, Controller, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/CreateProduct.dto';

@Controller({
  path: 'products',
  version: '1',
})
export class ProductsController {
  @Post()
  public create(@Body() product: CreateProductDto) {}
}
