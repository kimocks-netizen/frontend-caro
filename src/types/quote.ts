export interface QuoteProduct {
  id: string;
  title: string;
  image_url?: string[];
}

export interface QuoteItem {
  id: string;
  product_id: string;
  product: QuoteProduct;
  quantity: number;
  unit_price?: number;
  total_price?: number;
  message?: string;
}

export interface Quote {
  id: string;
  tracking_code: string;
  quote_number?: string;
  guest_name: string;
  guest_email: string;
  status: 'pending' | 'in_progress' | 'quoted' | 'rejected' | 'quote_issued';
  admin_notes?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  valid_until?: string;
  quote_date?: string;
  subtotal?: number;
  vat_amount?: number;
  total_amount?: number;
  vat_rate?: number;
  verified?: boolean;
  quote_items: QuoteItem[];
}

export interface QuoteRequestData {
  name: string;
  email: string;
  items: Array<{
    productId: string;
    quantity: number;
    message?: string;
  }>;
  message?: string;
}

export interface QuoteResponse {
  trackingCode: string;
  quoteNumber?: string;
}