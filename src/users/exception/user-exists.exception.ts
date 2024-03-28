export class UserExistsException extends Error {
  constructor(existsField = 'email', customMessage = null) {
    let message: string = `User with this ${existsField} exists`;
    if (customMessage) {
      message = customMessage;
    }

    super(message);
  }
}
