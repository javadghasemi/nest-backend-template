export class UserNotFoundException extends Error {
  constructor(field: string = 'email') {
    const message: string = `Requested user with this ${field} is not exists`;
    super(message);
  }
}
