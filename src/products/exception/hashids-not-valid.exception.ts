export class HashidsNotValidException extends Error {
  constructor() {
    const message = 'Hashids is not valid!';
    super(message);
  }
}
