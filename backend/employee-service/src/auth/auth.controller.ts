import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern("auth.login")
  login(@Payload() payload: { email: string; password: string }) {
    return this.authService.login(payload);
  }

  @MessagePattern("auth.get_profile")
  getProfile(@Payload() payload: { userId: number }) {
    return this.authService.getProfile(payload.userId);
  }
}
