import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, ShoppingBag, Truck } from 'lucide-react'
import { useAppSelector } from '../app/hooks'
import { BrandLogo } from '../components/common/BrandLogo'
import { PrimaryButton } from '../components/common/PrimaryButton'
import { getCartLines, placeDemoOrder, readCart, saveCart, type Cart } from '../features/orders/orderService'

const naira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`
export function CheckoutPage() {
  const user = useAppSelector((state) => state.auth.user)
  const navigate = useNavigate()
  const [cart, setCart] = useState<Cart>(() => readCart(user?.email ?? ''))
  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [placing, setPlacing] = useState(false)
  const lines = getCartLines(cart)
  const total = lines.reduce((sum, line) => sum + line.item.price * line.quantity, 0)

  const changeQuantity = (itemId: number, delta: number) => setCart((current) => {
    const next = { ...current }
    const quantity = (next[itemId] ?? 0) + delta
    if (quantity <= 0) delete next[itemId]
    else next[itemId] = quantity
    saveCart(user?.email ?? '', next)
    return next
  })

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (!user?.email) { setError('Please sign in again before placing an order.'); return }
    if (!lines.length) { setError('Your bag is empty. Add a dish from the menu first.'); return }
    if (phone.trim().replace(/\D/g, '').length < 7) { setError('Enter a valid phone number for your delivery.'); return }
    setPlacing(true)
    try {
      const order = placeDemoOrder({ email: user.email, customerName: fullName, phone, address })
      navigate('/orders', { state: { newOrderId: order.id }, replace: true })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'We could not place this demo order. Please try again.')
      setPlacing(false)
    }
  }

  return <main className="dashboard checkout-page">
    <header className="dash-nav"><BrandLogo/><nav><a href="/dashboard">Overview</a><a href="/orders">My orders</a><a href="/dashboard#menu">Explore menu</a></nav><div className="dash-tools"><span className="checkout-user">{user?.fullName}</span></div></header>
    <div className="dash-content checkout-content">
      <a className="orders-back" href="/dashboard#menu"><ArrowLeft size={15}/> Back to menu</a>
      <div className="orders-title"><div><span className="eyebrow">ALMOST TIME TO EAT</span><h1>Checkout</h1><p>Confirm your delivery details and review your order.</p></div><div className="checkout-demo-pill"><Truck size={15}/> Demo · Pay on delivery</div></div>
      {!lines.length ? <section className="checkout-empty"><ShoppingBag size={34}/><h2>Your bag is empty</h2><p>Choose a few Nigerian favourites from the menu to get started.</p><PrimaryButton onClick={() => navigate('/dashboard#menu')}>Browse the menu</PrimaryButton></section> : <form className="checkout-layout" onSubmit={submitOrder}>
        <section className="checkout-panel"><div className="checkout-panel-title"><span>01</span><div><h2>Delivery details</h2><p>Where should we bring your meal?</p></div></div>
          <div className="checkout-fields"><label className="checkout-field"><span>Full name</span><input value={fullName} onChange={(event) => setFullName(event.target.value)} required minLength={2} autoComplete="name"/></label><label className="checkout-field"><span>Phone number</span><input value={phone} onChange={(event) => setPhone(event.target.value)} required type="tel" placeholder="+234 800 000 0000" autoComplete="tel"/></label><label className="checkout-field checkout-address"><span>Delivery address</span><textarea value={address} onChange={(event) => setAddress(event.target.value)} required minLength={8} placeholder="House number, street, area and any helpful directions" autoComplete="street-address" rows={3}/></label></div>
          <div className="checkout-panel-title payment-title"><span>02</span><div><h2>Payment</h2><p>Choose how you’ll pay for this demo order.</p></div></div><label className="payment-option"><input type="radio" checked readOnly/><span><b>Pay on delivery</b><small>Pay the rider when your order arrives · demo only</small></span><strong>₦</strong></label>
        </section>
        <aside className="checkout-panel checkout-summary"><div className="checkout-panel-title"><span>03</span><div><h2>Your order</h2><p>{lines.reduce((n, line) => n + line.quantity, 0)} items</p></div></div><div className="checkout-lines">{lines.map(({ item, quantity }) => <div className="checkout-line" key={item.id}><span className="checkout-emoji">{item.emoji}</span><div className="checkout-dish"><b>{item.name}</b><small>{naira(item.price)} each</small><div className="menu-quantity"><button type="button" onClick={() => changeQuantity(item.id, -1)} aria-label={`Remove one ${item.name}`}><Minus size={13}/></button><b>{quantity}</b><button type="button" onClick={() => changeQuantity(item.id, 1)} aria-label={`Add one ${item.name}`}><Plus size={13}/></button></div></div><strong>{naira(item.price * quantity)}</strong></div>)}</div><div className="checkout-totals"><div><span>Subtotal</span><b>{naira(total)}</b></div><div><span>Delivery</span><b>₦0 <small>demo</small></b></div><div className="checkout-grand-total"><span>Total due on delivery</span><b>{naira(total)}</b></div></div>{error && <p className="checkout-error" role="alert">{error}</p>}<PrimaryButton type="submit" loading={placing}>Place demo order</PrimaryButton><p className="checkout-disclaimer">This saves a sample order in this browser. It does not charge you or notify a restaurant.</p></aside>
      </form>}
    </div>
    <footer className="dash-footer"><BrandLogo/><span>Good food has a way of making everything better.</span><a href="mailto:hello@cvfoods.example">We’re here to help</a></footer>
  </main>
}
