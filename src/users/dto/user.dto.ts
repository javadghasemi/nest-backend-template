export abstract class UserDto {
  public firstName: string;
  public lastName: string;
  public email: string;
  public username: string;

  constructor(
    firstName?: string,
    lastName?: string,
    email?: string,
    username?: string,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.username = username;
  }
}
