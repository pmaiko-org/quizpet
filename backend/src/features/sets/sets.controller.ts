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
  Query,
} from "@nestjs/common";
import { ApiExtraModels } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import type { AuthenticatedRequest } from "../auth/interfaces/authenticated-request.interface";
import { SetsService } from "./sets.service";
import { SetCreateDto } from "./dto/set/create.dto";
import { SetUpdateDto } from "./dto/set/update.dto";
import { TopicResponseDto } from "./dto/topic/response.dto";
import { SetDetailsResponseDto } from "./dto/set/details.response.dto";
import { CardDetailsResponseDto } from "./dto/card/details.response.dto";
import { SuccessResponseDto } from "../../common/dto/success.response.dto";
import { SetListQueryDto } from "./dto/set/list.query.dto";
import { SetListResponseDto } from "./dto/set/list.response.dto";

@ApiExtraModels(SetListQueryDto)
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
  getSets(@Query() query: SetListQueryDto): Promise<SetListResponseDto> {
    return this.setsService.getSets(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  getSet(
    @Param("id", new ParseUUIDPipe()) id: string,
  ): Promise<SetDetailsResponseDto | undefined> {
    return this.setsService.getSet(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id/cards")
  getCards(
    @Param("id", new ParseUUIDPipe()) id: string,
  ): Promise<CardDetailsResponseDto[]> {
    return this.setsService.getCards(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createSet(
    @Req() req: AuthenticatedRequest,
    @Body() createSetDto: SetCreateDto,
  ): Promise<SetDetailsResponseDto | undefined> {
    return this.setsService.createSet(req.user.sub, createSetDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  deleteSet(
    @Req() req: AuthenticatedRequest,
    @Param("id", new ParseUUIDPipe()) id: string,
  ): Promise<SuccessResponseDto> {
    return this.setsService.deleteSet(req.user.sub, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  updateSet(
    @Req() req: AuthenticatedRequest,
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() updateSetDto: SetUpdateDto,
  ): Promise<SetDetailsResponseDto | undefined> {
    return this.setsService.updateSet(req.user.sub, id, updateSetDto);
  }
}
