import { ProductDto } from './product.dto';

export class GetProductResponseDto extends ProductDto {
  public id: string;

  constructor(
    productId?: string,
    name?: string,
    price?: number,
    thumbnail?: string,
    photos?: string[],
  ) {
    super(name, price, thumbnail, photos);
    this.productId = productId;
  }
}
