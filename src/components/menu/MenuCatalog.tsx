import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Minus, Plus, Search, ShoppingBag, SlidersHorizontal, X } from 'lucide-react'
import { useAppSelector } from '../../app/hooks'
import { menuCategories, menuItems, type MenuCategory, type MenuItem } from '../../data/menuItems'
import { readCart, saveCart, type Cart } from '../../features/orders/orderService'

const PAGE_SIZE = 12
const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`

export function MenuCatalog() {
  const email = useAppSelector((state) => state.auth.user?.email ?? '')
  const navigate = useNavigate()
  const [category, setCategory] = useState<MenuCategory>('All dishes')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('featured')
  const [page, setPage] = useState(1)
  const [bag, setBag] = useState<Cart>(() => readCart(email))
  const [bagOpen, setBagOpen] = useState(false)

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const matches = menuItems.filter((item) =>
      (category === 'All dishes' || item.category === category) &&
      (!normalized || `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(normalized)),
    )
    if (sort === 'price-low') matches.sort((a, b) => a.price - b.price)
    if (sort === 'price-high') matches.sort((a, b) => b.price - a.price)
    if (sort === 'name') matches.sort((a, b) => a.name.localeCompare(b.name))
    return matches
  }, [category, query, sort])
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visibleItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const bagEntries = menuItems.filter((item) => bag[item.id])
  const bagCount = Object.values(bag).reduce((sum, count) => sum + count, 0)
  const bagTotal = bagEntries.reduce((sum, item) => sum + item.price * bag[item.id], 0)

  const updateBag = (item: MenuItem, change: number) => setBag((current) => {
    const count = (current[item.id] ?? 0) + change
    const next = { ...current }
    if (count <= 0) delete next[item.id]
    else next[item.id] = count
    saveCart(email, next)
    return next
  })
  const changeFilter = (next: MenuCategory) => { setCategory(next); setPage(1) }

  return <section className="menu-catalog" id="menu" aria-labelledby="menu-title">
    <div className="menu-heading">
      <div><span className="eyebrow">100 NIGERIAN FAVOURITES</span><h2 id="menu-title">Find your next favourite</h2><p>From smoky party jollof to regional soups, made with a taste of home.</p></div>
      <button className="menu-bag-button" onClick={() => setBagOpen(true)} aria-label={`Open bag with ${bagCount} items`}><ShoppingBag size={17}/><span>My bag</span><b>{bagCount}</b></button>
    </div>
    <div className="menu-controls">
      <label className="menu-search"><Search size={17}/><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="Search dishes, ingredients..." aria-label="Search menu"/>{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={15}/></button>}</label>
      <label className="menu-sort"><SlidersHorizontal size={16}/><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort menu"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A to Z</option></select></label>
    </div>
    <div className="menu-categories" role="group" aria-label="Filter menu by category">{menuCategories.map((item) => <button key={item} className={category === item ? 'selected' : ''} onClick={() => changeFilter(item)}>{item}{item === 'All dishes' && <span>{menuItems.length}</span>}</button>)}</div>
    <div className="menu-results"><span>{filtered.length ? <>Showing <b>{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</b> of <b>{filtered.length}</b> dishes</> : 'No dishes found'}</span><span>Prices in Nigerian naira · Demo menu</span></div>
    {visibleItems.length ? <div className="menu-grid">{visibleItems.map((item) => <article className="menu-item-card" key={item.id}>
      <div className="menu-item-art menu-item-photo" role="img" aria-label={`${item.name} food photo`} style={{ backgroundImage: "url(/menu-food-grid.jpg)", backgroundPosition: `${((item.id - 1) % 10) * (100 / 9)}% ${Math.floor((item.id - 1) / 10) * (100 / 9)}%` }}>{item.tag && <span className="menu-item-tag">{item.tag}</span>}<span className="menu-item-number">{String(item.id).padStart(2, '0')}</span></div>
      <div className="menu-item-content"><span className="menu-item-category">{item.category}</span><h3>{item.name}</h3><p>{item.description}</p><div className="menu-item-footer"><strong>{formatNaira(item.price)}</strong>{bag[item.id] ? <div className="menu-quantity"><button onClick={() => updateBag(item, -1)} aria-label={`Remove one ${item.name}`}><Minus size={14}/></button><b>{bag[item.id]}</b><button onClick={() => updateBag(item, 1)} aria-label={`Add one ${item.name}`}><Plus size={14}/></button></div> : <button className="menu-add-button" onClick={() => updateBag(item, 1)} aria-label={`Add ${item.name} to bag`}><Plus size={16}/></button>}</div></div>
    </article>)}</div> : <div className="menu-empty"><span>🍲</span><h3>No dishes match that search</h3><p>Try another name or choose a different category.</p><button onClick={() => { setQuery(''); changeFilter('All dishes') }}>Show all dishes</button></div>}
    {pages > 1 && <div className="menu-pagination"><button disabled={page === 1} onClick={() => { setPage(page - 1); document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }) }}><ArrowLeft size={15}/> Previous</button><span>Page <b>{page}</b> of {pages}</span><button disabled={page === pages} onClick={() => { setPage(page + 1); document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }) }}>Next <ArrowRight size={15}/></button></div>}
    {bagOpen && <div className="menu-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setBagOpen(false) }}><section className="menu-bag-modal" role="dialog" aria-modal="true" aria-labelledby="bag-title"><header><div><span className="eyebrow">YOUR SELECTION</span><h2 id="bag-title">My bag <small>({bagCount})</small></h2></div><button onClick={() => setBagOpen(false)} aria-label="Close bag"><X size={19}/></button></header>{bagEntries.length ? <><div className="menu-bag-lines">{bagEntries.map((item) => <div className="menu-bag-line" key={item.id}><span>{item.emoji}</span><div><b>{item.name}</b><small>{formatNaira(item.price)} each</small></div><div className="menu-quantity"><button onClick={() => updateBag(item, -1)} aria-label={`Remove one ${item.name}`}><Minus size={13}/></button><b>{bag[item.id]}</b><button onClick={() => updateBag(item, 1)} aria-label={`Add one ${item.name}`}><Plus size={13}/></button></div></div>)}</div><div className="menu-bag-total"><span>Subtotal</span><b>{formatNaira(bagTotal)}</b></div></> : <div className="menu-bag-empty"><ShoppingBag size={30}/><p>Your bag is waiting for something delicious.</p></div>}<p className="menu-bag-note">Demo preview · checkout is pay on delivery.</p><button className="menu-bag-close" disabled={!bagCount} onClick={() => { setBagOpen(false); navigate('/checkout') }}>{bagCount ? 'Continue to checkout' : 'Browse menu'}</button></section></div>}
  </section>
}
