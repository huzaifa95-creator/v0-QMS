from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from io import BytesIO
import base64
from typing import Dict, Any, List
from datetime import datetime

class QuotationPDFGenerator:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.custom_styles = self._create_custom_styles()
    
    def _create_custom_styles(self):
        """Create custom styles for the PDF"""
        return {
            'company_name': ParagraphStyle(
                'CompanyName',
                parent=self.styles['Heading1'],
                fontSize=24,
                textColor=colors.HexColor('#6366f1'),
                spaceAfter=6
            ),
            'section_header': ParagraphStyle(
                'SectionHeader',
                parent=self.styles['Heading2'],
                fontSize=14,
                textColor=colors.HexColor('#374151'),
                spaceBefore=12,
                spaceAfter=6
            ),
            'table_header': ParagraphStyle(
                'TableHeader',
                parent=self.styles['Normal'],
                fontSize=10,
                textColor=colors.white,
                alignment=1  # Center alignment
            )
        }
    
    def generate_quotation_pdf(self, quotation_data: Dict[str, Any]) -> bytes:
        """Generate PDF for quotation"""
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=0.5*inch)
        
        # Build PDF content
        story = []
        
        # Company header
        story.append(Paragraph("QMS Platform", self.custom_styles['company_name']))
        story.append(Paragraph("Quotation Management System", self.styles['Normal']))
        story.append(Spacer(1, 0.2*inch))
        
        # Quotation details
        story.append(Paragraph("QUOTATION", self.custom_styles['section_header']))
        
        quotation_info = [
            ['Quotation Number:', quotation_data.get('quotation_number', 'N/A')],
            ['Date:', datetime.now().strftime('%Y-%m-%d')],
            ['Valid Until:', str(quotation_data.get('valid_until', 'N/A'))],
            ['Status:', quotation_data.get('status', 'draft').upper()]
        ]
        
        quotation_table = Table(quotation_info, colWidths=[2*inch, 3*inch])
        quotation_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(quotation_table)
        story.append(Spacer(1, 0.2*inch))
        
        # Customer details
        story.append(Paragraph("BILL TO:", self.custom_styles['section_header']))
        customer_info = [
            [quotation_data.get('customer_name', 'N/A')],
            [quotation_data.get('customer_email', 'N/A')],
            [quotation_data.get('customer_address', 'N/A')]
        ]
        
        customer_table = Table(customer_info, colWidths=[4*inch])
        customer_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ]))
        story.append(customer_table)
        story.append(Spacer(1, 0.3*inch))
        
        # Items table
        story.append(Paragraph("ITEMS:", self.custom_styles['section_header']))
        
        # Table headers
        headers = ['Item', 'Qty', 'Unit Price', 'Discount', 'Tax', 'Total']
        items_data = [headers]
        
        # Add items
        for item in quotation_data.get('items', []):
            items_data.append([
                item.get('product_name', 'N/A'),
                str(item.get('quantity', 0)),
                f"${item.get('unit_price', 0):.2f}",
                f"{item.get('discount_percent', 0):.1f}%",
                f"{item.get('tax_rate', 0):.1f}%",
                f"${item.get('line_total', 0):.2f}"
            ])
        
        items_table = Table(items_data, colWidths=[2.5*inch, 0.7*inch, 1*inch, 0.8*inch, 0.7*inch, 1*inch])
        items_table.setStyle(TableStyle([
            # Header styling
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#6366f1')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            
            # Data styling
            ('ALIGN', (0, 1), (0, -1), 'LEFT'),  # Item names left-aligned
            ('ALIGN', (1, 1), (-1, -1), 'RIGHT'),  # Numbers right-aligned
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f9fafb')]),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
        ]))
        story.append(items_table)
        story.append(Spacer(1, 0.2*inch))
        
        # Totals
        totals_data = [
            ['Subtotal:', f"${quotation_data.get('subtotal', 0):.2f}"],
            ['Discount:', f"${quotation_data.get('discount_amount', 0):.2f}"],
            ['Tax:', f"${quotation_data.get('tax_amount', 0):.2f}"],
            ['Total:', f"${quotation_data.get('total_amount', 0):.2f}"]
        ]
        
        totals_table = Table(totals_data, colWidths=[1.5*inch, 1*inch])
        totals_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LINEABOVE', (0, -1), (-1, -1), 2, colors.black),
        ]))
        
        # Right-align the totals table
        totals_wrapper = Table([[totals_table]], colWidths=[6.5*inch])
        totals_wrapper.setStyle(TableStyle([('ALIGN', (0, 0), (-1, -1), 'RIGHT')]))
        story.append(totals_wrapper)
        
        # Notes
        if quotation_data.get('notes'):
            story.append(Spacer(1, 0.3*inch))
            story.append(Paragraph("NOTES:", self.custom_styles['section_header']))
            story.append(Paragraph(quotation_data['notes'], self.styles['Normal']))
        
        # Terms and conditions
        story.append(Spacer(1, 0.3*inch))
        story.append(Paragraph("TERMS & CONDITIONS:", self.custom_styles['section_header']))
        terms = """
        1. This quotation is valid for the period specified above.<br/>
        2. Prices are subject to change without notice.<br/>
        3. Payment terms: Net 30 days from invoice date.<br/>
        4. All sales are final unless otherwise specified.
        """
        story.append(Paragraph(terms, self.styles['Normal']))
        
        # Build PDF
        doc.build(story)
        buffer.seek(0)
        return buffer.getvalue()

# Global PDF generator instance
pdf_generator = QuotationPDFGenerator()
