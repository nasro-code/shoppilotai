import '@shopify/shopify-api/adapters/node';
import { shopifyApi, ApiVersion } from '@shopify/shopify-api';
import { restResources } from '@shopify/shopify-api/rest/admin/2026-01';
import { sendRefundConfirmation, sendShippingNotification } from './channels/resend';

// Initialize Shopify API client
export const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  scopes: (process.env.SHOPIFY_SCOPES || '').split(',').filter(Boolean),
  hostName: process.env.SHOPIFY_HOST!.replace(/^https?:\/\//, ''),
  apiVersion: ApiVersion.January26,
  restResources,
});

export interface ShopifyOrder {
  order_id: string;
  order_number: number;
  status: string;
  financial_status: string;
  fulfillment_status: string;
  created_at: string;
  updated_at: string;
  total_price: string;
  subtotal_price: string;
  total_tax: string;
  currency: string;
  customer: {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  } | null;
  shipping_address: {
    first_name?: string;
    last_name?: string;
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    country?: string;
    zip?: string;
    phone?: string;
  } | null;
  billing_address: {
    first_name?: string;
    last_name?: string;
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    country?: string;
    zip?: string;
    phone?: string;
  } | null;
  line_items: Array<{
    id: number;
    product_id?: number;
    variant_id?: number;
    title: string;
    variant_title?: string;
    quantity: number;
    price: string;
    sku?: string;
    vendor?: string;
    fulfillment_status?: string;
  }>;
  fulfillments: Array<{
    id: number;
    status: string;
    tracking_company?: string;
    tracking_number?: string;
    tracking_url?: string;
    created_at: string;
  }>;
  refund_status?: string;
  refunds?: Array<{
    id: number;
    created_at: string;
    note?: string;
    total: string;
    line_items: Array<{
      quantity: number;
      line_item: {
        title: string;
        price: string;
      };
    }>;
  }>;
  tags: string;
  note?: string;
  cancel_reason?: string;
  cancelled_at?: string;
}

export interface ShopifyCustomer {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  orders_count: number;
  total_spent: string;
  created_at: string;
  updated_at: string;
  phone?: string;
  state: string;
  verified_email: boolean;
  tax_exempt: boolean;
  tags: string;
  currency: string;
  addresses: Array<{
    id: number;
    first_name?: string;
    last_name?: string;
    company?: string;
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    country?: string;
    zip?: string;
    phone?: string;
    default: boolean;
  }>;
}

export interface ShippingStatus {
  order_id: string;
  order_number: number;
  status: string;
  tracking_company?: string;
  tracking_number?: string;
  tracking_url?: string;
  estimated_delivery?: string;
  last_update: string;
}

export interface RefundResult {
  success: boolean;
  message: string;
  refund_id?: string;
  amount?: string;
}

/**
 * Create a Shopify REST session for a specific store
 */
export async function createSession(shopDomain: string, accessToken: string) {
  return shopify.session.custom({
    shop: shopDomain,
    accessToken,
  });
}

/**
 * Get Shopify store connection for a user
 */
export async function getUserStore(userId: string): Promise<{
  shop_domain: string;
  access_token: string;
  shop_name?: string;
} | null> {
  const { createClient } = await import('@/utils/supabase/server');
  const supabase = await createClient();

  const { data: store, error } = await supabase
    .from('stores')
    .select('shop_domain, access_token, shop_name')
    .eq('user_id', userId)
    .single();

  if (error || !store) {
    return null;
  }

  return {
    shop_domain: store.shop_domain,
    access_token: store.access_token,
    shop_name: store.shop_name,
  };
}

/**
 * Execute a GraphQL query against Shopify Admin API
 */
async function shopifyGraphQL<T>(session: ReturnType<typeof shopify.session.custom>, query: string, variables?: Record<string, unknown>): Promise<T | null> {
  const client = new shopify.clients.Graphql({ session });

  try {
    const response = await client.query<T>({ data: query, variables });
    return response.data;
  } catch (error: any) {
    console.error('Shopify GraphQL error:', error);
    if (error.response?.status === 401) {
      throw new Error('Shopify token expired. Please reconnect your store.');
    }
    throw error;
  }
}

/**
 * Execute a REST API call against Shopify Admin API
 */
async function shopifyREST(session: ReturnType<typeof shopify.session.custom>, path: string, method?: string, body?: unknown) {
  const client = new shopify.clients.Rest({ session });

  try {
    const response = await client.request({
      path,
      method: method || 'GET',
      data: body,
    });
    return response;
  } catch (error: any) {
    console.error('Shopify REST error:', error);
    if (error.response?.status === 401) {
      throw new Error('Shopify token expired. Please reconnect your store.');
    }
    throw error;
  }
}

/**
 * Get orders by customer email using GraphQL
 */
async function getOrdersByEmailGraphQL(session: ReturnType<typeof shopify.session.custom>, email: string): Promise<ShopifyOrder[]> {
  const query = `
    query getOrdersByEmail($query: String!) {
      orders(query: $query, first: 10) {
        edges {
          node {
            id
            orderNumber
            name
            createdAt
            updatedAt
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            subtotalTotalSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            totalTaxSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            financialStatus
            fulfillmentStatus
            cancelReason
            cancelledAt
            tags
            note
            customer {
              id
              email
              firstName
              lastName
              phone
            }
            shippingAddress {
              firstName
              lastName
              address1
              address2
              city
              province
              country
              zip
              phone
            }
            lineItems(first: 50) {
              edges {
                node {
                  id
                  title
                  variantTitle
                  quantity
                  originalTotalSet {
                    shopMoney {
                      amount
                      currencyCode
                    }
                  }
                  variant {
                    sku
                    product {
                      vendor
                    }
                  }
                  fulfillmentStatus
                }
              }
            }
            fulfillments(first: 10) {
              edges {
                node {
                  id
                  status
                  trackingCompany
                  trackingNumber
                  trackingUrl
                  createdAt
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyGraphQL<{
    orders: {
      edges: Array<{
        node: {
          id: string;
          orderNumber: number;
          name: string;
          createdAt: string;
          updatedAt: string;
          totalPriceSet: { shopMoney: { amount: string; currencyCode: string } };
          subtotalTotalSet: { shopMoney: { amount: string; currencyCode: string } };
          totalTaxSet: { shopMoney: { amount: string; currencyCode: string } };
          financialStatus: string;
          fulfillmentStatus: string;
          cancelReason?: string;
          cancelledAt?: string;
          tags: string;
          note?: string;
          customer: {
            id: string;
            email: string;
            firstName?: string;
            lastName?: string;
            phone?: string;
          } | null;
          shippingAddress: {
            firstName?: string;
            lastName?: string;
            address1?: string;
            address2?: string;
            city?: string;
            province?: string;
            country?: string;
            zip?: string;
            phone?: string;
          } | null;
          lineItems: {
            edges: Array<{
              node: {
                id: string;
                title: string;
                variantTitle?: string;
                quantity: number;
                originalTotalSet: { shopMoney: { amount: string; currencyCode: string } };
                variant?: {
                  sku?: string;
                  product?: { vendor?: string };
                } | null;
                fulfillmentStatus?: string;
              };
            }>;
          };
          fulfillments: {
            edges: Array<{
              node: {
                id: string;
                status: string;
                trackingCompany?: string;
                trackingNumber?: string;
                trackingUrl?: string;
                createdAt: string;
              };
            }>;
          };
        };
      }>;
    };
  }>(session, query, { query: `email:${email}` });

  if (!data?.orders?.edges) {
    return [];
  }

  return data.orders.edges.map((edge) => {
    const node = edge.node;
    return {
      order_id: node.id.replace('gid://shopify/Order/', ''),
      order_number: node.orderNumber,
      status: node.fulfillmentStatus || 'pending',
      financial_status: node.financialStatus,
      fulfillment_status: node.fulfillmentStatus,
      created_at: node.createdAt,
      updated_at: node.updatedAt,
      total_price: node.totalPriceSet.shopMoney.amount,
      subtotal_price: node.subtotalTotalSet.shopMoney.amount,
      total_tax: node.totalTaxSet.shopMoney.amount,
      currency: node.totalPriceSet.shopMoney.currencyCode,
      customer: node.customer
        ? {
            id: parseInt(node.customer.id),
            email: node.customer.email,
            first_name: node.customer.firstName || undefined,
            last_name: node.customer.lastName || undefined,
            phone: node.customer.phone || undefined,
          }
        : null,
      shipping_address: node.shippingAddress
        ? {
            first_name: node.shippingAddress.firstName || undefined,
            last_name: node.shippingAddress.lastName || undefined,
            address1: node.shippingAddress.address1 || undefined,
            address2: node.shippingAddress.address2 || undefined,
            city: node.shippingAddress.city || undefined,
            province: node.shippingAddress.province || undefined,
            country: node.shippingAddress.country || undefined,
            zip: node.shippingAddress.zip || undefined,
            phone: node.shippingAddress.phone || undefined,
          }
        : null,
      billing_address: null, // Would need separate query
      line_items: node.lineItems.edges.map((item) => ({
        id: parseInt(item.node.id),
        product_id: undefined,
        variant_id: undefined,
        title: item.node.title,
        variant_title: item.node.variantTitle || undefined,
        quantity: item.node.quantity,
        price: item.node.originalTotalSet.shopMoney.amount,
        sku: item.node.variant?.sku || undefined,
        vendor: item.node.variant?.product?.vendor || undefined,
        fulfillment_status: item.node.fulfillmentStatus || undefined,
      })),
      fulfillments: node.fulfillments.edges.map((f) => ({
        id: parseInt(f.node.id),
        status: f.node.status,
        tracking_company: f.node.trackingCompany || undefined,
        tracking_number: f.node.trackingNumber || undefined,
        tracking_url: f.node.trackingUrl || undefined,
        created_at: f.node.createdAt,
      })),
      tags: node.tags,
      note: node.note || undefined,
      cancel_reason: node.cancelReason || undefined,
      cancelled_at: node.cancelledAt || undefined,
    };
  });
}

/**
 * Get a single order by Shopify Order ID using REST
 */
async function getOrderByIdREST(
  session: ReturnType<typeof shopify.session.custom>,
  orderId: string
): Promise<ShopifyOrder | null> {
  // Remove any # prefix and get the numeric ID
  const cleanId = orderId.replace(/^#/, '').replace(/^AC-/, '');

  try {
    const response = await shopifyREST(session, `orders/${cleanId}.json`);

    if (!response.body?.order) {
      return null;
    }

    const order = response.body.order;
    return {
      order_id: String(order.id),
      order_number: order.order_number,
      status: order.fulfillment_status || 'pending',
      financial_status: order.financial_status,
      fulfillment_status: order.fulfillment_status,
      created_at: order.created_at,
      updated_at: order.updated_at,
      total_price: String(order.total_price),
      subtotal_price: String(order.subtotal_price),
      total_tax: String(order.total_tax),
      currency: order.currency,
      customer: order.customer
        ? {
            id: order.customer.id,
            email: order.customer.email,
            first_name: order.customer.first_name,
            last_name: order.customer.last_name,
            phone: order.customer.phone,
          }
        : null,
      shipping_address: order.shipping_address
        ? {
            first_name: order.shipping_address.first_name,
            last_name: order.shipping_address.last_name,
            address1: order.shipping_address.address1,
            address2: order.shipping_address.address2,
            city: order.shipping_address.city,
            province: order.shipping_address.province,
            country: order.shipping_address.country,
            zip: order.shipping_address.zip,
            phone: order.shipping_address.phone,
          }
        : null,
      billing_address: order.billing_address
        ? {
            first_name: order.billing_address.first_name,
            last_name: order.billing_address.last_name,
            address1: order.billing_address.address1,
            address2: order.billing_address.address2,
            city: order.billing_address.city,
            province: order.billing_address.province,
            country: order.billing_address.country,
            zip: order.billing_address.zip,
            phone: order.billing_address.phone,
          }
        : null,
      line_items: order.line_items.map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        title: item.title,
        variant_title: item.variant_title,
        quantity: item.quantity,
        price: String(item.price),
        sku: item.sku,
        vendor: item.vendor,
        fulfillment_status: item.fulfillment_status,
      })),
      fulfillments: order.fulfillments.map((f: any) => ({
        id: f.id,
        status: f.status,
        tracking_company: f.tracking_company,
        tracking_number: f.tracking_number,
        tracking_url: f.tracking_url,
        created_at: f.created_at,
      })),
      refunds: order.refunds?.map((r: any) => ({
        id: r.id,
        created_at: r.created_at,
        note: r.note,
        total: String(r.total),
        line_items: r.line_items.map((li: any) => ({
          quantity: li.quantity,
          line_item: {
            title: li.line_item.title,
            price: String(li.line_item.price),
          },
        })),
      })),
      tags: order.tags,
      note: order.note,
      cancel_reason: order.cancel_reason,
      cancelled_at: order.cancelled_at,
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Retrieve full details for a specific Shopify order
 * Tries GraphQL first (by order number), falls back to REST (by ID)
 */
export async function getOrderById(orderId: string, userId?: string): Promise<ShopifyOrder | null> {
  // If userId provided, get their store; otherwise use default session
  let session: ReturnType<typeof shopify.session.custom>;

  if (userId) {
    const store = await getUserStore(userId);
    if (!store) {
      throw new Error('No Shopify store connected. Please connect your store in Settings.');
    }
    session = await createSession(store.shop_domain, store.access_token);
  } else {
    // For direct calls without userId, expect orderId to contain shop info
    // This is for backwards compatibility
    throw new Error('userId is required for getOrderById');
  }

  // Try REST API first (simpler for ID-based lookups)
  return getOrderByIdREST(session, orderId);
}

/**
 * Retrieve orders by customer email
 */
export async function getOrderByEmail(email: string, userId?: string): Promise<ShopifyOrder[]> {
  let session: ReturnType<typeof shopify.session.custom>;

  if (userId) {
    const store = await getUserStore(userId);
    if (!store) {
      throw new Error('No Shopify store connected. Please connect your store in Settings.');
    }
    session = await createSession(store.shop_domain, store.access_token);
  } else {
    throw new Error('userId is required for getOrderByEmail');
  }

  return getOrdersByEmailGraphQL(session, email);
}

/**
 * Get real-time tracking and delivery estimates for an order
 */
export async function getShippingStatus(orderId: string, userId?: string): Promise<ShippingStatus | { error: string }> {
  try {
    const order = await getOrderById(orderId, userId);
    if (!order) {
      return { error: 'Order not found' };
    }

    // Get the latest fulfillment
    const latestFulfillment = order.fulfillments?.[0];
    if (!latestFulfillment) {
      return {
        order_id: order.order_id,
        order_number: order.order_number,
        status: order.fulfillment_status || 'unfulfilled',
        last_update: order.updated_at,
      };
    }

    // Send shipping notification email if this is a new fulfillment with tracking
    if (latestFulfillment.tracking_number && latestFulfillment.tracking_url && order.customer?.email) {
      await sendShippingNotification(
        order.customer.email,
        `#${order.order_number}`,
        latestFulfillment.tracking_url,
        latestFulfillment.tracking_company
      );
    }

    return {
      order_id: order.order_id,
      order_number: order.order_number,
      status: latestFulfillment.status,
      tracking_company: latestFulfillment.tracking_company,
      tracking_number: latestFulfillment.tracking_number,
      tracking_url: latestFulfillment.tracking_url,
      last_update: latestFulfillment.created_at,
    };
  } catch (error: any) {
    return { error: error.message || 'Failed to fetch shipping status' };
  }
}

/**
 * Initiate a refund for an eligible order using REST API
 */
export async function requestRefund(
  orderId: string,
  reason: string,
  userId?: string,
  refundAmount?: string
): Promise<RefundResult> {
  let session: ReturnType<typeof shopify.session.custom>;

  if (userId) {
    const store = await getUserStore(userId);
    if (!store) {
      throw new Error('No Shopify store connected. Please connect your store in Settings.');
    }
    session = await createSession(store.shop_domain, store.access_token);
  } else {
    throw new Error('userId is required for requestRefund');
  }

  try {
    // First get the order to check eligibility and get line items
    const order = await getOrderById(orderId, userId);
    if (!order) {
      return { success: false, message: 'Order not found' };
    }

    // Check if already refunded or cancelled
    if (order.refund_status === 'refunded' || order.cancelled_at) {
      return { success: false, message: 'This order has already been refunded or cancelled.' };
    }

    // Check financial status
    if (order.financial_status !== 'paid' && order.financial_status !== 'partially_refunded') {
      return {
        success: false,
        message: `Cannot refund order with status "${order.financial_status}". Order must be paid.`,
      };
    }

    // Create refund via REST API
    const refundData: Record<string, unknown> = {
      order_id: parseInt(orderId.replace(/\D/g, '')),
      note: reason,
      refund_line_items: order.line_items.map((item) => ({
        line_item_id: item.id,
        quantity: item.quantity,
        restock_type: 'no_restock',
      })),
      notify: true,
    };

    if (refundAmount) {
      refundData.amount = refundAmount;
    }

    const response = await shopifyREST(session, `orders/${orderId}/refunds.json`, 'POST', refundData);

    if (!response.body?.refund) {
      return { success: false, message: 'Failed to create refund' };
    }

    const refund = response.body.refund;

    // Send refund confirmation email to customer
    if (order.customer?.email) {
      const orderName = `#${order.order_number}`;
      await sendRefundConfirmation(order.customer.email, orderName, refund.total);
    }

    return {
      success: true,
      message: `Refund of ${refund.total} ${order.currency} has been processed successfully.`,
      refund_id: String(refund.id),
      amount: refund.total,
    };
  } catch (error: any) {
    console.error('Refund error:', error);
    if (error.response?.status === 422) {
      return { success: false, message: `Invalid refund request: ${error.response?.body?.errors?.order?.[0] || 'Unknown error'}` };
    }
    return { success: false, message: `Refund failed: ${error.message}` };
  }
}

/**
 * Retrieve all orders for a store (paginated)
 */
export async function getAllOrders(userId?: string, limit: number = 50): Promise<ShopifyOrder[]> {
  let session: ReturnType<typeof shopify.session.custom>;

  if (userId) {
    const store = await getUserStore(userId);
    if (!store) {
      throw new Error('No Shopify store connected. Please connect your store in Settings.');
    }
    session = await createSession(store.shop_domain, store.access_token);
  } else {
    throw new Error('userId is required for getAllOrders');
  }

  try {
    const response = await shopifyREST(session, `orders.json?limit=${limit}&status=any`);

    if (!response.body?.orders) {
      return [];
    }

    return response.body.orders.map((order: any) => ({
      order_id: String(order.id),
      order_number: order.order_number,
      status: order.fulfillment_status || 'pending',
      financial_status: order.financial_status,
      fulfillment_status: order.fulfillment_status,
      created_at: order.created_at,
      updated_at: order.updated_at,
      total_price: String(order.total_price),
      subtotal_price: String(order.subtotal_price),
      total_tax: String(order.total_tax),
      currency: order.currency,
      customer: order.customer
        ? {
            id: order.customer.id,
            email: order.customer.email,
            first_name: order.customer.first_name,
            last_name: order.customer.last_name,
            phone: order.customer.phone,
          }
        : null,
      shipping_address: order.shipping_address
        ? {
            first_name: order.shipping_address.first_name,
            last_name: order.shipping_address.last_name,
            address1: order.shipping_address.address1,
            address2: order.shipping_address.address2,
            city: order.shipping_address.city,
            province: order.shipping_address.province,
            country: order.shipping_address.country,
            zip: order.shipping_address.zip,
            phone: order.shipping_address.phone,
          }
        : null,
      billing_address: null,
      line_items: order.line_items.map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        title: item.title,
        variant_title: item.variant_title,
        quantity: item.quantity,
        price: String(item.price),
        sku: item.sku,
        vendor: item.vendor,
        fulfillment_status: item.fulfillment_status,
      })),
      fulfillments: order.fulfillments.map((f: any) => ({
        id: f.id,
        status: f.status,
        tracking_company: f.tracking_company,
        tracking_number: f.tracking_number,
        tracking_url: f.tracking_url,
        created_at: f.created_at,
      })),
      tags: order.tags,
      note: order.note,
      cancel_reason: order.cancel_reason,
      cancelled_at: order.cancelled_at,
    }));
  } catch (error: any) {
    console.error('Error fetching all orders:', error);
    return [];
  }
}

/**
 * Get customer by email
 */
export async function getCustomerByEmail(email: string, userId?: string): Promise<ShopifyCustomer | null> {
  let session: ReturnType<typeof shopify.session.custom>;

  if (userId) {
    const store = await getUserStore(userId);
    if (!store) {
      throw new Error('No Shopify store connected. Please connect your store in Settings.');
    }
    session = await createSession(store.shop_domain, store.access_token);
  } else {
    throw new Error('userId is required for getCustomerByEmail');
  }

  try {
    const response = await shopifyREST(session, `customers.json?query=${encodeURIComponent(email)}`);

    if (!response.body?.customers || response.body.customers.length === 0) {
      return null;
    }

    const customer = response.body.customers[0];
    return {
      id: customer.id,
      email: customer.email,
      first_name: customer.first_name,
      last_name: customer.last_name,
      orders_count: customer.orders_count,
      total_spent: String(customer.total_spent),
      created_at: customer.created_at,
      updated_at: customer.updated_at,
      phone: customer.phone,
      state: customer.state,
      verified_email: customer.verified_email,
      tax_exempt: customer.tax_exempt,
      tags: customer.tags,
      currency: customer.currency,
      addresses: (customer.addresses || []).map((addr: any) => ({
        id: addr.id,
        first_name: addr.first_name,
        last_name: addr.last_name,
        company: addr.company,
        address1: addr.address1,
        address2: addr.address2,
        city: addr.city,
        province: addr.province,
        country: addr.country,
        zip: addr.zip,
        phone: addr.phone,
        default: addr.default,
      })),
    };
  } catch (error: any) {
    console.error('Error fetching customer:', error);
    return null;
  }
}

/**
 * Connect a Shopify store via OAuth callback
 */
export async function connectStore(shopDomain: string, authCode: string) {
  try {
    const session = await shopify.auth.sessionFromCallback({
      isOnline: false,
      rawRequest: {
        query: `?shop=${encodeURIComponent(shopDomain)}&code=${authCode}&state=`,
      } as any,
    });

    return {
      shop_domain: session.shop,
      access_token: session.accessToken,
      shop_name: session.shop,
    };
  } catch (error: any) {
    console.error('Shopify OAuth error:', error);
    throw new Error(`Failed to connect store: ${error.message}`);
  }
}

/**
 * Get OAuth URL to start store connection
 */
export async function getConnectUrl(shopDomain: string, callbackPath: string = '/api/shopify/callback') {
  const authUrl = await shopify.auth.begin({
    shop: shopDomain,
    callbackPath,
    isOnline: false,
  });

  return authUrl;
}
