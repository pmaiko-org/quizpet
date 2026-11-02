export class AuthStatusResponseDto {
  authenticated: boolean;

  constructor(authenticated: boolean) {
    this.authenticated = authenticated;
  }
}
