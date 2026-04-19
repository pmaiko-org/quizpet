export class SuccessResponseDto {
  success: boolean;

  constructor(success = true) {
    this.success = success;
  }
}
