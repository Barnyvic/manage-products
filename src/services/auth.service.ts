import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model";
import env from "../config/env";
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "../interfaces/auth.interface";

export class AuthService {
  private generateToken(userId: string): string {
    const payload: JwtPayload = { id: userId };
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const user = await User.create(userData);
    const token = this.generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const user = await User.findOne({ email: credentials.email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.comparePassword(credentials.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = this.generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
