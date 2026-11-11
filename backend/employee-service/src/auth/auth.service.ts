import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { User } from "../entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private formatUserProfile(user: User) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      name: user.employee ? user.employee.name : "Administrator",
      department: user.employee?.department?.name || null,
      position: user.employee?.position || null,
      employeeCode: user.employee?.employeeCode || null,
      phone: user.employee?.phone || null,
      joinDate: user.employee?.joinDate || null,
    };
  }

  async login(payload: { email: string; password: string }) {
    const { email, password } = payload;
    const user = await this.userRepository.findOne({
      where: { email },
      relations: { employee: { department: true } },
    });

    if (!user) {
      return { success: false, message: "Invalid email or password" };
    }

    if (user.employee && user.employee.isActive === 0) {
      return { success: false, message: "Employee account is inactive" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: "Invalid email or password" };
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
    });

    return {
      success: true,
      data: {
        accessToken,
        user: this.formatUserProfile(user),
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { employee: { department: true } },
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    return {
      success: true,
      data: this.formatUserProfile(user),
    };
  }
}
