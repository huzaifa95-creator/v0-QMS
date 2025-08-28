import { apiClient, type ApiResponse } from "./index"
import type { User, LoginRequest, RegisterRequest } from "./types"

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export class AuthService {
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials)

    if (response.data) {
      apiClient.setToken(response.data.access_token)
    }

    return response
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>("/auth/register", userData)

    if (response.data) {
      apiClient.setToken(response.data.access_token)
    }

    return response
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<User>("/auth/me")
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put<User>("/auth/profile", userData)
  }

  logout() {
    apiClient.clearToken()
  }

  isAuthenticated(): boolean {
    return typeof window !== "undefined" && !!localStorage.getItem("auth_token")
  }
}

export const authService = new AuthService()
