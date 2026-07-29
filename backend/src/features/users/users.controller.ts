import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiExtraModels } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import type { AuthenticatedRequest } from "../auth/interfaces/authenticated-request.interface";
import { UsersService } from "./users.service";
import { UserResponseDto } from "./dto/user.response.dto";
import { UserListQueryDto } from "./dto/user-list.query.dto";
import { UserListResponseDto } from "./dto/user-list.response.dto";
import { ProfileStatsResponseDto } from "./dto/profile-stats.response.dto";
import { ProfileUpdateDto } from "./dto/profile-update.dto";

@ApiExtraModels(UserListQueryDto, ProfileStatsResponseDto, ProfileUpdateDto)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get("me")
  getMe(
    @Req() req: AuthenticatedRequest,
  ): Promise<UserResponseDto | undefined> {
    return this.usersService.getMe(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me/stats")
  getMyStats(
    @Req() req: AuthenticatedRequest,
  ): Promise<ProfileStatsResponseDto> {
    return this.usersService.getMyStats(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("me")
  updateMe(
    @Req() req: AuthenticatedRequest,
    @Body() body: ProfileUpdateDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateMe(req.user.sub, body);
  }

  @Get()
  getUsers(@Query() query: UserListQueryDto): Promise<UserListResponseDto> {
    return this.usersService.getUsers(query);
  }
}
