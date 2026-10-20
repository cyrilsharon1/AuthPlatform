import { menuItems, type MenuItem } from '../../data/menuItems'

export type Cart = Record<number, number>
export interface OrderLine { itemId: number; name: string; emoji: string; unitPrice: number; quantity: number }
export interface FoodOrder { id: string; email: string; customerName: string; phone: string; address: string; paymentMethod: 'Pay on delivery'; status: 'Received'; createdAt: string; items: OrderLine[]; total: number }

const cartKey = (email: string) => `cv-foods-cart:${email.trim().toLowerCase()}`
const ordersKey = (email: string) => `cv-foods-orders:${email.trim().toLowerCase()}`
const safeRead = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') as T ?? fallback } catch { return fallback }
}
export function readCart(email: string): Cart { return safeRead<Cart>(cartKey(email), {}) }
export function saveCart(email: string, cart: Cart): void { localStorage.setItem(cartKey(email), JSON.stringify(cart)) }
export function getCartLines(cart: Cart): { item: MenuItem; quantity: number }[] { return menuItems.flatMap((item) => cart[item.id] ? [{ item, quantity: cart[item.id] }] : []) }
export function readOrders(email: string): FoodOrder[] { return safeRead<FoodOrder[]>(ordersKey(email), []).sort((a, b) => b.createdAt.localeCompare(a.createdAt)) }
export function placeDemoOrder(input: { email: string; customerName: string; phone: string; address: string }): FoodOrder {
  const lines = getCartLines(readCart(input.email))
  if (!lines.length) throw new Error('Your bag is empty. Add a dish before checkout.')
  const order: FoodOrder = {
    id: `CV-${Date.now().toString(36).toUpperCase()}`,
    email: input.email.trim().toLowerCase(), customerName: input.customerName.trim(), phone: input.phone.trim(), address: input.address.trim(),
    paymentMethod: 'Pay on delivery', status: 'Received', createdAt: new Date().toISOString(),
    items: lines.map(({ item, quantity }) => ({ itemId: item.id, name: item.name, emoji: item.emoji, unitPrice: item.price, quantity })),
    total: lines.reduce((sum, { item, quantity }) => sum + item.price * quantity, 0),
  }
  const orders = readOrders(input.email)
  localStorage.setItem(ordersKey(input.email), JSON.stringify([order, ...orders]))
  saveCart(input.email, {})
  return order
}
