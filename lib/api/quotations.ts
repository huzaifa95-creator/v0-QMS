import { apiClient, type ApiResponse } from "./index"
import type { Quotation, QuotationCreateRequest } from "./types"

export class QuotationService {
  async getQuotations(params?: {
    skip?: number
    limit?: number
    status?: string
    customer_id?: string
  }): Promise<ApiResponse<Quotation[]>> {
    const searchParams = new URLSearchParams()

    if (params?.skip) searchParams.append("skip", params.skip.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.status) searchParams.append("status", params.status)
    if (params?.customer_id) searchParams.append("customer_id", params.customer_id)

    const queryString = searchParams.toString()
    const endpoint = queryString ? `/quotations?${queryString}` : "/quotations"

    return apiClient.get<Quotation[]>(endpoint)
  }

  async getQuotation(id: string): Promise<ApiResponse<Quotation>> {
    return apiClient.get<Quotation>(`/quotations/${id}`)
  }

  async createQuotation(quotation: QuotationCreateRequest): Promise<ApiResponse<Quotation>> {
    return apiClient.post<Quotation>("/quotations", quotation)
  }

  async updateQuotation(id: string, quotation: Partial<QuotationCreateRequest>): Promise<ApiResponse<Quotation>> {
    return apiClient.put<Quotation>(`/quotations/${id}`, quotation)
  }

  async updateQuotationStatus(id: string, status: string): Promise<ApiResponse<Quotation>> {
    return apiClient.put<Quotation>(`/quotations/${id}/status`, { status })
  }

  async generatePDF(id: string): Promise<ApiResponse<{ pdf_url: string }>> {
    return apiClient.post<{ pdf_url: string }>(`/quotations/${id}/pdf`)
  }

  async deleteQuotation(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/quotations/${id}`)
  }
}

export const quotationService = new QuotationService()
