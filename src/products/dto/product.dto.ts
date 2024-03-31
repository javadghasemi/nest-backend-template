export abstract class ProductDto {
  public name: string;
  public price: number;
  public thumbnail: string;
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
