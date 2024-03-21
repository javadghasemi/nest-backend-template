export class WrongLoginInfoException extends Error {
  constructor(field: string = 'email', customMessage: string | null = null) {
    let message = `There is no user with this ${field} and password`;
    if (customMessage) {
      message = customMessage;
    }

    super(message);
  }
}
