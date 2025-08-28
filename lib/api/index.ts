// Export client and types first
export { apiClient, type ApiResponse } from "./client"
export * from "./types"

// Then export services that depend on client
export { authService, type AuthResponse } from "./auth"
export { customerService } from "./customers"
export { quotationService } from "./quotations"
export { inventoryService } from "./inventory"
