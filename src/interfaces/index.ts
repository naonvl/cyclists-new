/**
 * @module App
 */
export interface IAppProvider {
  children: React.ReactNode
}

/**
 * @module App
 * @name ResponseVariantsShopify
 * @description Variant product from Shopify
 */
export type ResponseVariantsShopify = {
  id: number
  product_id: number
  title: string
  price: string
  sku: string
  position: number
  inventory_policy: string
  compare_at_price: string
  fulfillment_service: string
  inventory_management: string
  option1: null | string
  option2: null | string
  option3: null | string
  created_at: string
  updated_at: string
  taxable: boolean
  barcode: string
  grams: number
  image_id: number
  weight: number
  weight_unit: string
  inventory_item_id: number
  inventory_quantity: number
  old_inventory_quantity: number
  requires_shipping: boolean
  admin_graphql_api_id: string
}

/**
 * @module App
 * @name ResponseCustomerShopify
 * @description Customer Object from Shopify
 */
export type ResponseCustomerShopify = {
  id: number
  email: string
  accepts_marketing: boolean
  created_at: string
  updated_at: string
  first_name: string
  last_name: string
  orders_count: number
  state: string
  total_spent: string
  last_order_id: null | number
  note: null | string
  verified_email: boolean
  multipass_identifier: null | any
  tax_exempt: boolean
  tags: string
  last_order_name: null | string
  currency: string
  phone: null | string
}

export interface IVariants {
  id: number
  product_id: number
  title: string
  price: string
  sku: string
  position: number
  inventory_policy: string
  compare_at_price: string
  fulfillment_service: string
  inventory_management: string
  option1: string
  option2: string
  option3: null | string
  created_at: string
  updated_at: string
  taxable: boolean
  barcode: string
  grams: number
  image_id: number
  weight: number
  weight_unit: string
  inventory_item_id: number
  inventory_quantity: number
  old_inventory_quantity: number
  requires_shipping: boolean
  admin_graphql_api_id: string
}

export interface ICustomer {
  id: number
  email: string
  accepts_marketing: boolean
  created_at: string
  updated_at: string
  first_name: string
  last_name: string
  orders_count: number
  state: string
  total_spent: string
  last_order_id: null | number
  note: null | string
  verified_email: true
  multipass_identifier: null | any
  tax_exempt: false
  tags: string
  last_order_name: null | string
  currency: string
  phone: null | string
}
