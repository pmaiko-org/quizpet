import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UsersService } from "./users.service";
import { UserResponseDto } from "./dto/user.response.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get("me")
  getMe(@Req() req): Promise<UserResponseDto | undefined> {
    return this.usersService.getMe(req.user.sub);
  }

  @Get()
  getUsers() {
    return "1";
  }
}
