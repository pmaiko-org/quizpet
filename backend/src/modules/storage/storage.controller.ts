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
import { StorageDbBackupsService } from './services/storage-db-backups.service';

@Controller('storage')
export class StorageController {
  constructor(
    private readonly storageService: StorageService,
    private readonly storageDbBackupsService: StorageDbBackupsService,
  ) {}

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
  @Post('backups/run')
  runBackup() {
    return this.storageDbBackupsService.createBackup();
  }

  @UseGuards(JwtAuthGuard)
  @Delete('files/:id')
  deleteFile(@Param('id') id: string) {
    return this.storageService.deleteFile(id);
  }
}
