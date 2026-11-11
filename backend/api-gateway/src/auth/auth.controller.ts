import { Controller, Post, Get, Body, Inject, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { sendRpc } from "../common/rpc.helper";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { CurrentUser, AuthenticatedUser } from "./current-user.decorator";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    @Inject("EMPLOYEE_SERVICE")
    private readonly employeeServiceClient: ClientProxy,
  ) {}

  @Post("login")
  @ApiOperation({ summary: "Sign in user (Admin / Employee)" })
  login(@Body() body: LoginDto) {
    return sendRpc(this.employeeServiceClient, "auth.login", body);
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current authenticated user profile" })
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return sendRpc(this.employeeServiceClient, "auth.get_profile", {
      userId: user.userId,
    });
  }
}
