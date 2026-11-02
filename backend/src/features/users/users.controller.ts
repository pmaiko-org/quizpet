import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiExtraModels } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/security/jwt-auth.guard";
import type { IAuthenticatedRequest } from "../auth/interfaces/authenticated-request.interface";
import { UsersService } from "./users.service";
import { UserResponseDto } from "./dto/user.response.dto";
import { UserListQueryDto } from "./dto/user-list.query.dto";
import { UserListResponseDto } from "./dto/user-list.response.dto";
import { ProfileStatsResponseDto } from "./dto/profile-stats.response.dto";
import { ProfileUpdateDto } from "./dto/profile-update.dto";
import { AccountDeleteDto } from "./dto/account-delete.dto";
import { SuccessResponseDto } from "../../common/dto/success.response.dto";
import { SessionService } from "../auth/session/session.service";

@ApiExtraModels(
  UserListQueryDto,
  ProfileStatsResponseDto,
  ProfileUpdateDto,
  AccountDeleteDto,
  SuccessResponseDto,
)
@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionService: SessionService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get("me")
  getMe(
    @Req() req: IAuthenticatedRequest,
  ): Promise<UserResponseDto | undefined> {
    return this.usersService.getMe(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me/stats")
  getMyStats(
    @Req() req: IAuthenticatedRequest,
  ): Promise<ProfileStatsResponseDto> {
    return this.usersService.getMyStats(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("me")
  updateMe(
    @Req() req: IAuthenticatedRequest,
    @Body() body: ProfileUpdateDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateMe(req.user.sub, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("me")
  async deleteMe(
    @Req() req: IAuthenticatedRequest,
    @Body() body: AccountDeleteDto,
  ): Promise<SuccessResponseDto> {
    await this.sessionService.revokeAll(req.user.sub, req);
    return this.usersService.deleteMe(req.user.sub, body);
  }

  @Get()
  getUsers(@Query() query: UserListQueryDto): Promise<UserListResponseDto> {
    return this.usersService.getUsers(query);
  }
}
