import {
  Controller,
  Post,
  Get,
  Body,
  Inject,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { lastValueFrom } from "rxjs";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { CurrentUser } from "./current-user.decorator";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    @Inject("EMPLOYEE_SERVICE")
    private readonly employeeServiceClient: ClientProxy,
  ) {}

  @Post("login")
  @ApiOperation({ summary: "Sign in user (Admin / Employee)" })
  @ApiBody({
    schema: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: { type: "string", example: "admin@dexa.com" },
        password: { type: "string", example: "admin123" },
      },
    },
  })
  async login(@Body() body: { email?: string; password?: string }) {
    if (!body.email || !body.password) {
      throw new BadRequestException("Email and password are required");
    }

    const result = await lastValueFrom(
      this.employeeServiceClient.send("auth.login", {
        email: body.email,
        password: body.password,
      }),
    );

    if (!result.success) {
      throw new BadRequestException(result.message);
    }

    return result;
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current authenticated user profile" })
  async getProfile(@CurrentUser() user: any) {
    const result = await lastValueFrom(
      this.employeeServiceClient.send("auth.get_profile", {
        userId: user.userId,
      }),
    );

    if (!result.success) {
      throw new BadRequestException(result.message);
    }

    return result;
  }
}

