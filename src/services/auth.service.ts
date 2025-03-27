import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model";
import env from "../config/env";
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "../interfaces/auth.interface";

/**
 * Generates a JWT token for a user
 * @param userId - The ID of the user to generate a token for
 * @returns A signed JWT token
 */
const generateToken = (userId: string): string => {
  const payload: JwtPayload = { id: userId };
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
};

/**
 * Registers a new user in the system
 * @param userData - The user registration data containing email, password, and name
 * @returns Promise containing the authentication response with token and user info
 * @throws Error if a user with the same email already exists
 */
export const register = async (
  userData: RegisterData
): Promise<AuthResponse> => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const user = await User.create(userData);
  const token = generateToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

/**
 * Authenticates a user with their credentials
 * @param credentials - The login credentials containing email and password
 * @returns Promise containing the authentication response with token and user info
 * @throws Error if the credentials are invalid or the user doesn't exist
 */
export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const user = await User.findOne({ email: credentials.email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await user.comparePassword(credentials.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};
