import { apiClient, type ApiResponse } from "./index"
import type { Customer, CustomerCreateRequest } from "./types"

export class CustomerService {
  async getCustomers(params?: {
    skip?: number
    limit?: number
    search?: string
  }): Promise<ApiResponse<Customer[]>> {
    const searchParams = new URLSearchParams()

    if (params?.skip) searchParams.append("skip", params.skip.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.search) searchParams.append("search", params.search)

    const queryString = searchParams.toString()
    const endpoint = queryString ? `/customers?${queryString}` : "/customers"

    return apiClient.get<Customer[]>(endpoint)
  }

  async getCustomer(id: string): Promise<ApiResponse<Customer>> {
    return apiClient.get<Customer>(`/customers/${id}`)
  }

  async createCustomer(customer: CustomerCreateRequest): Promise<ApiResponse<Customer>> {
    return apiClient.post<Customer>("/customers", customer)
  }

  async updateCustomer(id: string, customer: Partial<CustomerCreateRequest>): Promise<ApiResponse<Customer>> {
    return apiClient.put<Customer>(`/customers/${id}`, customer)
  }

  async deleteCustomer(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/customers/${id}`)
  }
}

export const customerService = new CustomerService()
