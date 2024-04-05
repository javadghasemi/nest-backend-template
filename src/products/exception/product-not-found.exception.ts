export class ProductNotFoundException extends Error {
  constructor() {
    const message: string = 'Requested product is not found';

    super(message);
  }
}
