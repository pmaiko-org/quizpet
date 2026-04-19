import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { SetsService } from "./sets.service";
import { CreateSetDto } from "./dto/create-set.dto";
import { UpdateSetDto } from "./dto/update-set.dto";
import { TopicResponseDto } from "./dto/topic.response.dto";
import { SetListItemResponseDto } from "./dto/set-list-item.response.dto";
import { SetDetailsResponseDto } from "./dto/set-details.response.dto";
import { SuccessResponseDto } from "../../common/dto/success.response.dto";

@Controller("sets")
export class SetsController {
  constructor(private readonly setsService: SetsService) {}

  @UseGuards(JwtAuthGuard)
  @Get("topics")
  getTopics(): Promise<TopicResponseDto[]> {
    return this.setsService.getTopics();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getSets(): Promise<SetListItemResponseDto[]> {
    return this.setsService.getSets();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  getSet(
    @Param("id", new ParseUUIDPipe()) id: string,
  ): Promise<SetDetailsResponseDto | undefined> {
    return this.setsService.getSet(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createSet(
    @Req() req,
    @Body() createSetDto: CreateSetDto,
  ): Promise<SetDetailsResponseDto | undefined> {
    return this.setsService.createSet(req.user.sub, createSetDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  deleteSet(
    @Req() req,
    @Param("id", new ParseUUIDPipe()) id: string,
  ): Promise<SuccessResponseDto> {
    return this.setsService.deleteSet(req.user.sub, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  updateSet(
    @Req() req,
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() updateSetDto: UpdateSetDto,
  ): Promise<SetDetailsResponseDto | undefined> {
    return this.setsService.updateSet(req.user.sub, id, updateSetDto);
  }
}
