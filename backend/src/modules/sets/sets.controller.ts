import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SetsService } from './sets.service';

@Controller('sets')
export class SetsController {
  constructor(private readonly setsService: SetsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getSets(@Req() req) {
    return this.setsService.findByUser(req.user);
  }
}
