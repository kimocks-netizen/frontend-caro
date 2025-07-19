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
  message?: string;
}

export interface Quote {
  id: string;
  tracking_code: string;
  guest_name: string;
  guest_email: string;
  status: 'pending' | 'quoted' | 'rejected' | 'quote_issued';
  admin_notes?: string;
  created_at: string;
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
}