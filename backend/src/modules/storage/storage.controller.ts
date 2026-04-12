import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './services/storage.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.storageService.uploadFile(file);
  }

  @UseGuards(JwtAuthGuard)
  @Get('files')
  getFiles() {
    return this.storageService.getFiles();
  }

  @UseGuards(JwtAuthGuard)
  @Delete('files/:id')
  deleteFile(@Param('id') id: string) {
    return this.storageService.deleteFile(id);
  }
}
