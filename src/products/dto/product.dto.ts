import {
  IsArray,
  IsNumber,
  IsString,
  IsUrl,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

export abstract class ProductDto {
  public productId: string;

  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsNumber()
  @IsNotEmpty()
  public price: number;

  @IsUrl()
  @IsNotEmpty()
  public thumbnail: string;

  @IsArray()
  @IsNotEmpty()
  public photos: string[];

  constructor(
    name?: string,
    price?: number,
    thumbnail?: string,
    photos?: string[],
  ) {
    this.name = name;
    this.price = price;
    this.thumbnail = thumbnail;
    this.photos = photos;
  }
}
