import { Injectable } from '@nestjs/common';

@Injectable()
export class SetsService {
  findByUser(data: any) {
    console.log(data);
    return '1';
  }
}
