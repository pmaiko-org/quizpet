import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SetsService } from './sets.service';
import { CreateSetDto } from './dto/create-set.dto';

@Controller('sets')
export class SetsController {
  constructor(private readonly setsService: SetsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getSets() {
    return this.setsService.getSets();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createSet(@Req() req, @Body() createSetDto: CreateSetDto) {
    return this.setsService.createSet(req.user.sub, createSetDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteSet(@Req() req, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.setsService.deleteSet(req.user.sub, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('topics')
  getTopics() {
    return this.setsService.getTopics();
  }
}
