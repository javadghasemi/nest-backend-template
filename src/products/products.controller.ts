import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateProductRequestDto } from './dto/create-product-request.dto';
import { ProductsService } from './products.service';
import { User } from '../authentication/decorator/user.decorator';
import { LoggedInUserInterface } from '../authentication/interfaces/logged-in-user.interface';
import { AuthGuard } from '../authentication/guards/auth.guard';

@Controller({
  path: 'products',
  version: '1',
})
export class ProductsController {
  constructor(private productsService: ProductsService) {}
  @Post()
  @UseGuards(AuthGuard)
  public create(
    @Body() product: CreateProductRequestDto,
    @User() user: LoggedInUserInterface,
  ) {
    return this.productsService.create(product, user);
  }
}
