import { register, login } from "../services/auth.service";
import { RegisterData, LoginCredentials } from "../interfaces/auth.interface";

describe("Auth Service", () => {
  const mockUser: RegisterData = {
    email: "test@example.com",
    password: "Password123!",
    name: "Test User",
  };

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const result = await register(mockUser);
      expect(result).toHaveProperty("token");
      expect(result.user).toHaveProperty("email", mockUser.email);
      expect(result.user).toHaveProperty("name", mockUser.name);
      expect(result.user).not.toHaveProperty("password");
    });

    it("should throw error if user already exists", async () => {
      await register(mockUser);
      await expect(register(mockUser)).rejects.toThrow("Email already exists");
    });
  });

  describe("login", () => {
    beforeEach(async () => {
      await register(mockUser);
    });

    it("should login successfully with correct credentials", async () => {
      const credentials: LoginCredentials = {
        email: mockUser.email,
        password: mockUser.password,
      };
      const result = await login(credentials);
      expect(result).toHaveProperty("token");
      expect(result.user).toHaveProperty("email", mockUser.email);
    });

    it("should throw error with incorrect password", async () => {
      const credentials: LoginCredentials = {
        email: mockUser.email,
        password: "wrongpassword",
      };
      await expect(login(credentials)).rejects.toThrow("Invalid credentials");
    });

    it("should throw error with non-existent email", async () => {
      const credentials: LoginCredentials = {
        email: "nonexistent@example.com",
        password: mockUser.password,
      };
      await expect(login(credentials)).rejects.toThrow("Invalid credentials");
    });
  });
});
