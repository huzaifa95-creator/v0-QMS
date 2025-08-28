"use client"

import { useState } from "react"
import { QuotationList } from "./quotation-list"
import { QuotationBuilder } from "./quotation-builder"
import { QuotationViewer } from "./quotation-viewer"

type View = "list" | "create" | "edit" | "view"

export function QuotationManagement() {
  const [currentView, setCurrentView] = useState<View>("list")
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null)

  const handleCreateNew = () => {
    setSelectedQuotation(null)
    setCurrentView("create")
  }

  const handleEdit = (quotation: any) => {
    setSelectedQuotation(quotation)
    setCurrentView("edit")
  }

  const handleView = (quotation: any) => {
    setSelectedQuotation(quotation)
    setCurrentView("view")
  }

  const handleBack = () => {
    setCurrentView("list")
    setSelectedQuotation(null)
  }

  const handleEditFromViewer = () => {
    setCurrentView("edit")
  }

  if (currentView === "create" || currentView === "edit") {
    return (
      <QuotationBuilder onBack={handleBack} editingQuotation={currentView === "edit" ? selectedQuotation : undefined} />
    )
  }

  if (currentView === "view") {
    return <QuotationViewer quotation={selectedQuotation} onBack={handleBack} onEdit={handleEditFromViewer} />
  }

  return <QuotationList onCreateNew={handleCreateNew} onEdit={handleEdit} onView={handleView} />
}
