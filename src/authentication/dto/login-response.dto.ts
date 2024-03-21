export class LoginResponseDto {
  public accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}
