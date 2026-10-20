import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Check, Clock3, LogOut, MapPin, Package, ShoppingBag } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logout } from '../features/auth/authSlice'
import { BrandLogo } from '../components/common/BrandLogo'
import { PrimaryButton } from '../components/common/PrimaryButton'
import { readOrders, type FoodOrder } from '../features/orders/orderService'

const naira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`
const dateLabel = (value: string) => new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
export function OrdersPage() {
  const user = useAppSelector((state) => state.auth.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const orders: FoodOrder[] = user?.email ? readOrders(user.email) : []
  const newOrderId = (location.state as { newOrderId?: string } | null)?.newOrderId

  return <main className="dashboard orders-page">
    <header className="dash-nav"><BrandLogo/><nav><a href="/dashboard">Overview</a><a className="active" href="/orders">My orders</a><a href="/dashboard#menu">Explore menu</a></nav><div className="dash-tools"><button className="profile-chip"><span>{user?.fullName.slice(0, 1).toUpperCase() ?? 'C'}</span><b>{user?.fullName.split(' ')[0] ?? 'Guest'}</b></button><button className="icon-button logout" onClick={async () => { await dispatch(logout()); navigate('/login', { replace: true }) }} aria-label="Sign out"><LogOut size={17}/></button></div></header>
    <div className="dash-content orders-content">
      <a className="orders-back" href="/dashboard"><ArrowLeft size={15}/> Back to overview</a>
      <div className="orders-title"><div><span className="eyebrow">YOUR CV FOODS ACCOUNT</span><h1>My orders</h1><p>Keep track of your meals and delivery updates here.</p></div><div className="delivery-tag"><MapPin size={15}/><span>Delivering to <b>Lekki, Lagos</b></span></div></div>
      {newOrderId && <div className="order-success" role="status"><Check size={18}/><span>Your demo order <b>{newOrderId}</b> has been received.</span></div>}
      <section className="orders-panel"><div className="orders-panel-head"><div><h2>Order history</h2><p>Your recent and current orders</p></div><span className="orders-count">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</span></div>
        {orders.length ? <div className="orders-list">{orders.map((order) => <article className="order-history-card" key={order.id}><header><div><span className="order-status"><i/> {order.status}</span><h3>Order {order.id}</h3><p>{dateLabel(order.createdAt)}</p></div><strong>{naira(order.total)}</strong></header><div className="order-history-items">{order.items.map((item) => <div key={item.itemId}><span>{item.emoji}</span><b>{item.quantity} × {item.name}</b><span>{naira(item.unitPrice * item.quantity)}</span></div>)}</div><footer><span><MapPin size={14}/>{order.address}</span><span>{order.paymentMethod} · demo</span></footer></article>)}</div> : <div className="orders-empty"><div className="orders-empty-icon"><Package size={30}/><ShoppingBag size={18}/></div><span className="eyebrow">NOTHING ON THE WAY</span><h2>Your order history starts here</h2><p>You haven’t placed an order yet. Browse the menu and find something delicious.</p><PrimaryButton onClick={() => navigate('/dashboard#menu')}>Explore the menu <ArrowUpRight size={16}/></PrimaryButton></div>}
      </section>
      <div className="orders-help"><Clock3 size={16}/><span>Demo orders are saved in this browser. Live restaurant updates are not connected.</span></div>
    </div>
    <footer className="dash-footer"><BrandLogo/><span>Good food has a way of making everything better.</span><a href="mailto:hello@cvfoods.example">We’re here to help</a></footer>
  </main>
}
