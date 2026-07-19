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
import { UsersService } from "./users.service";
import { UserResponseDto } from "./dto/user.response.dto";
import { UserListQueryDto } from "./dto/user-list.query.dto";
import { UserListResponseDto } from "./dto/user-list.response.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@ApiExtraModels(UserListQueryDto, UpdateProfileDto)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get("me")
  getMe(@Req() req): Promise<UserResponseDto | undefined> {
    return this.usersService.getMe(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("me")
  updateMe(
    @Req() req,
    @Body() body: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateMe(req.user.sub, body);
  }

  @Get()
  getUsers(@Query() query: UserListQueryDto): Promise<UserListResponseDto> {
    return this.usersService.getUsers(query);
  }
}
