import { apiClient, type ApiResponse } from "./index"
import type { InventoryItem, StockMovement } from "./types"

export class InventoryService {
  async getInventory(params?: {
    skip?: number
    limit?: number
    search?: string
    low_stock_only?: boolean
  }): Promise<ApiResponse<InventoryItem[]>> {
    const searchParams = new URLSearchParams()

    if (params?.skip) searchParams.append("skip", params.skip.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.search) searchParams.append("search", params.search)
    if (params?.low_stock_only) searchParams.append("low_stock_only", "true")

    const queryString = searchParams.toString()
    const endpoint = queryString ? `/inventory?${queryString}` : "/inventory"

    return apiClient.get<InventoryItem[]>(endpoint)
  }

  async updateInventoryItem(
    id: string,
    data: {
      current_stock?: number
      minimum_stock?: number
      maximum_stock?: number
      reorder_point?: number
      unit_cost?: number
    },
  ): Promise<ApiResponse<InventoryItem>> {
    return apiClient.put<InventoryItem>(`/inventory/${id}`, data)
  }

  async createStockMovement(movement: {
    product_id: string
    transaction_type: "purchase" | "sale" | "adjustment" | "return" | "transfer"
    quantity: number
    unit_cost?: number
    reference_id?: string
    notes?: string
  }): Promise<ApiResponse<StockMovement>> {
    return apiClient.post<StockMovement>("/inventory/movements", movement)
  }

  async getStockMovements(params?: {
    skip?: number
    limit?: number
    product_id?: string
    transaction_type?: string
  }): Promise<ApiResponse<StockMovement[]>> {
    const searchParams = new URLSearchParams()

    if (params?.skip) searchParams.append("skip", params.skip.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.product_id) searchParams.append("product_id", params.product_id)
    if (params?.transaction_type) searchParams.append("transaction_type", params.transaction_type)

    const queryString = searchParams.toString()
    const endpoint = queryString ? `/inventory/movements?${queryString}` : "/inventory/movements"

    return apiClient.get<StockMovement[]>(endpoint)
  }

  async getAnalytics(): Promise<
    ApiResponse<{
      total_products: number
      total_value: number
      low_stock_items: number
      out_of_stock_items: number
      recent_movements: number
      top_moving_products: Array<{ product_name: string; movements: number }>
    }>
  > {
    return apiClient.get("/inventory/analytics")
  }
}

export const inventoryService = new InventoryService()
