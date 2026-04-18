export interface ShopifyOrder {
  order_id: string;
  status: string;
  shipping_date: string;
  total_price: string;
  items: string[];
  tracking_number?: string;
  is_refundable: boolean;
}

/**
 * Mock function to retrieve an order by email.
 * This will be replaced with real Shopify API calls later.
 */
export async function getOrderByEmail(email: string): Promise<ShopifyOrder | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (email === "john@example.com") {
    return {
      order_id: "#AC-12345",
      status: "Shipped",
      shipping_date: "2024-04-20",
      total_price: "$125.00",
      items: ["Pro Wireless Headphones", "USB-C Cable"],
      tracking_number: "TRACK-99281-XYZ",
      is_refundable: true
    };
  }

  if (email === "sarah@example.com") {
    return {
      order_id: "#AC-20458",
      status: "Processing",
      shipping_date: "Estimated April 25",
      total_price: "$89.99",
      items: ["Leather Phone Case", "Screen Protector"],
      is_refundable: false
    };
  }

  return null;
}

/**
 * Mock function to retrieve all orders.
 */
export async function getAllOrders(): Promise<ShopifyOrder[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [
    {
      order_id: "#AC-12345",
      status: "Shipped",
      shipping_date: "2024-04-20",
      total_price: "$125.00",
      items: ["Pro Wireless Headphones", "USB-C Cable"],
      tracking_number: "TRACK-99281-XYZ",
      is_refundable: true
    },
    {
      order_id: "#AC-20458",
      status: "Processing",
      shipping_date: "Estimated April 25",
      total_price: "$89.99",
      items: ["Leather Phone Case", "Screen Protector"],
      is_refundable: false
    },
    {
      order_id: "#AC-30112",
      status: "Delivered",
      shipping_date: "2024-04-15",
      total_price: "$210.50",
      items: ["Smart Watch Series 5"],
      is_refundable: true
    },
    {
      order_id: "#AC-40992",
      status: "Cancelled",
      shipping_date: "N/A",
      total_price: "$45.00",
      items: ["Power Bank 20k mAh"],
      is_refundable: false
    }
  ];
}
