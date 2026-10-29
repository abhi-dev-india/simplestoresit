import { type FormEvent, type MouseEvent, type ReactNode, createContext, useContext, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ArrowRight, BookOpen, Check, CreditCard, Minus, PackageCheck, Plus, Search, ShieldCheck, ShoppingBag, ShoppingCart, Star, Trash2, Truck, UserRound, X } from 'lucide-react';
import { categories, initialProducts, type Product, rupees } from './data';

type CartLine = { productId: string; quantity: number };
type DemoUser = { name: string; email: string; role: 'customer' | 'admin' };
type OrderItem = { productId: string; name: string; price: number; quantity: number; image: string; unit: string };
type Order = { id: string; customerName: string; email: string; address: string; items: OrderItem[]; subtotal: number; delivery: number; total: number; status: string; createdAt: string };
type AppData = { products: Product[]; cart: CartLine[]; user: DemoUser | null; orders: Order[] };
type AppContextValue = AppData & {
  setProducts: (products: Product[]) => void;
  setCart: (cart: CartLine[]) => void;
  setUser: (user: DemoUser | null) => void;
  setOrders: (orders: Order[]) => void;
  search: string;
  setSearch: (value: string) => void;
  notice: string;
  setNotice: (value: string) => void;
};

const queryClient = new QueryClient();
const StoreContext = createContext<AppContextValue | null>(null);
const STORAGE = { products: 'ssi.products.v1', cart: 'ssi.cart.v1', user: 'ssi.user.v1', orders: 'ssi.orders.v1' };
const demoOrders: Order[] = [
  {
    id: 'SSI-24018',
    customerName: 'Aarav Mehta',
    email: 'shopper@simplestores.in',
    address: '42 Lake View Road, Pune 411001',
    items: [
      { productId: 'p01', name: 'Everyday Basmati Rice', price: 189, quantity: 2, image: 'https://images.pexels.com/photos/7421206/pexels-photo-7421206.jpeg?auto=compress&cs=tinysrgb&w=700', unit: '1 kg' },
      { productId: 'p07', name: 'Masala Munch Mix', price: 89, quantity: 1, image: 'https://images.pexels.com/photos/5638732/pexels-photo-5638732.jpeg?auto=compress&cs=tinysrgb&w=700', unit: '400 g' },
    ],
    subtotal: 467,
    delivery: 49,
    total: 516,
    status: 'Confirmed (demo)',
    createdAt: '2026-10-26T10:30:00.000Z',
  },
  {
    id: 'SSI-24017',
    customerName: 'Mira Shah',
    email: 'mira@example.test',
    address: '18 Green Park, Ahmedabad 380001',
    items: [
      { productId: 'p37', name: 'Colour Pop Pencil Set', price: 149, quantity: 2, image: 'https://images.pexels.com/photos/1598620617137-2d8a4cfd3065/pexels-photo-1598620617137-2d8a4cfd3065.jpeg?auto=compress&cs=tinysrgb&w=700', unit: '12 colours' },
    ],
    subtotal: 298,
    delivery: 49,
    total: 347,
    status: 'Packed (demo)',
    createdAt: '2026-10-25T08:10:00.000Z',
  },
];

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function mergeCatalogProducts(savedProducts: Product[]): Product[] {
  if (!Array.isArray(savedProducts)) return initialProducts;
  const savedIds = new Set(savedProducts.map(product => product.id));
  return [...savedProducts, ...initialProducts.filter(product => !savedIds.has(product.id))];
}

function useSavedState<T>(key: string, fallback: T, migrate?: (stored: T) => T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const stored = readStorage(key, fallback);
    return migrate ? migrate(stored) : stored;
  });
  const save = (next: T) => {
    setValue(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* storage may be unavailable */ }
  };
  return [value, save];
}

function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useSavedState(STORAGE.products, initialProducts, mergeCatalogProducts);
  const [cart, setCart] = useSavedState<CartLine[]>(STORAGE.cart, []);
  const [user, setUser] = useSavedState<DemoUser | null>(STORAGE.user, null);
  const [orders, setOrders] = useSavedState<Order[]>(STORAGE.orders, demoOrders);
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const value = useMemo(() => ({ products, setProducts, cart, setCart, user, setUser, orders, setOrders, search, setSearch, notice, setNotice }), [products, cart, user, orders, search, notice]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('Store context is not available');
  return context;
}

function AppShell() {
  const { cart, search, setSearch, user, notice, setNotice } = useStore();
  const [, navigate] = useLocation();
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);
  const searchChange = (value: string) => {
    setSearch(value);
    if (value && window.location.pathname !== '/') navigate('/');
  };
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="topline">A school project prototype · no real payments or deliveries</div>
        <div className="nav-wrap">
          <Link href="/" className="brand" data-testid="link-home">
            <span className="brand-mark"><ShoppingBag size={19} /></span><span>SimpleStores<span style={{ color: '#f0b36b' }}>IT</span></span>
          </Link>
          <div className="header-search"><Search size={17} /><input aria-label="Search products" data-testid="input-search" value={search} onChange={e => searchChange(e.target.value)} placeholder="Search everyday finds..." /></div>
          <nav className="nav-links" aria-label="Main navigation">
            <Link href="/" data-testid="link-store">Shop</Link>
            <Link href="/cart" data-testid="link-cart-nav">Cart</Link>
            <Link href="/account" data-testid="link-account-nav">Account</Link>
            <Link href="/admin" data-testid="link-admin-nav">Admin</Link>
          </nav>
          <div className="nav-actions">
            <Link href="/account" className="icon-link" data-testid="link-account-shortcut"><UserRound size={20} /><span>{user?.name?.split(' ')[0] || 'Sign in'}</span></Link>
            <Link href="/cart" className="icon-link" data-testid="link-cart-shortcut" aria-label={`Cart, ${count} items`}><ShoppingCart size={20} /><span className="cart-count" data-testid="text-cart-count">{count}</span></Link>
          </div>
        </div>
      </header>
      {notice && <div className="page" style={{ paddingTop: 12, paddingBottom: 0 }}><div className="notice" role="status" data-testid="status-notice">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss message" data-testid="button-dismiss-notice" style={{ float: 'right', border: 0, background: 'transparent' }}><X size={15} /></button></div></div>}
      <Switch>
        <Route path="/" component={StorePage} />
        <Route path="/cart" component={CartPage} />
        <Route path="/checkout" component={CheckoutPage} />
        <Route path="/account" component={AccountPage} />
        <Route path="/admin" component={AdminPage} />
        <Route component={NotFound} />
      </Switch>
      <footer className="footer"><div className="footer-inner">
        <div><div className="brand"><span className="brand-mark"><ShoppingBag size={18} /></span><span>SimpleStores<span style={{ color: '#f0b36b' }}>IT</span></span></div><small>Made for a school presentation. Every order, account and stock update is a browser-only simulation.</small></div>
        <small>Prototype marketplace · India · Prices shown in ₹</small>
      </div></footer>
    </div>
  );
}

function addCartLine(cart: CartLine[], productId: string, stock: number, quantity = 1) {
  const found = cart.find(line => line.productId === productId);
  return found
    ? cart.map(line => line.productId === productId ? { ...line, quantity: Math.min(stock, line.quantity + quantity) } : line)
    : [...cart, { productId, quantity: Math.min(stock, quantity) }];
}

function ProductCard({ product, onOpen }: { product: Product; onOpen: (p: Product) => void }) {
  const { setCart, cart, setNotice } = useStore();
  const add = (event: MouseEvent) => {
    event.stopPropagation();
    if (product.stock <= 0) return;
    if ((cart.find(line => line.productId === product.id)?.quantity ?? 0) >= product.stock) {
      setNotice(`Only ${product.stock} ${product.unit} available in the demo inventory.`);
      return;
    }
    setCart(addCartLine(cart, product.id, product.stock));
    setNotice(`${product.name} added to your cart.`);
  };
  return (
    <article className="product-card" data-testid={`card-product-${product.id}`}>
      <button onClick={() => onOpen(product)} data-testid={`button-view-${product.id}`} style={{ display: 'block', width: '100%', padding: 0, border: 0, background: 'transparent', textAlign: 'left' }}>
        <img className="product-image" src={product.image} alt={product.name} data-testid={`img-product-${product.id}`} loading="lazy" />
      </button>
      <div className="product-body">
        <div className="product-cat">{product.category}</div>
        <button className="product-title" onClick={() => onOpen(product)} data-testid={`button-title-${product.id}`} style={{ display: 'block', border: 0, padding: 0, background: 'transparent', color: 'inherit', textAlign: 'left', width: '100%' }}>{product.name}</button>
        <div className="rating"><Star size={12} fill="currentColor" /> <strong>{product.rating.toFixed(1)}</strong><span style={{ color: '#87919e' }}>({product.ratingCount})</span></div>
        <div className="price-row"><span className="price">{rupees(product.price)}</span><span className="old-price">{rupees(product.originalPrice)}</span></div>
        <div className="product-foot"><span className="tiny-note">{product.unit} · {product.stock > 0 ? 'In stock' : 'Sold out'}</span><button className="add-btn" onClick={add} disabled={product.stock < 1} aria-label={`Add ${product.name} to cart`} data-testid={`button-add-${product.id}`}><Plus size={17} /></button></div>
      </div>
    </article>
  );
}

function ProductModal({ product, close }: { product: Product; close: () => void }) {
  const { cart, setCart, setNotice } = useStore();
  const add = () => {
    if (product.stock <= 0) {
      setNotice('This product is out of stock in the demo inventory.');
      return;
    }
    if ((cart.find(line => line.productId === product.id)?.quantity ?? 0) >= product.stock) {
      setNotice(`Only ${product.stock} ${product.unit} available in the demo inventory.`);
      return;
    }
    setCart(addCartLine(cart, product.id, product.stock));
    setNotice(`${product.name} added to your cart.`);
    close();
  };
  return <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) close(); }}>
    <section className="modal" role="dialog" aria-modal="true" aria-label={product.name} data-testid="dialog-product">
      <button className="close-modal" onClick={close} aria-label="Close product details" data-testid="button-close-product"><X size={18} /></button>
      <img src={product.image} alt={product.name} />
      <div className="modal-content"><div className="product-cat">{product.category}</div><h2 className="page-title" style={{ fontSize: 27, marginTop: 9 }}>{product.name}</h2>
        <div className="rating"><Star size={13} fill="currentColor" /><strong>{product.rating.toFixed(1)}</strong><span style={{ color: '#87919e' }}>from {product.ratingCount} demo ratings</span></div>
        <p className="page-subtitle" style={{ margin: '18px 0' }}>{product.description}</p>
        <p className="tiny-note">Sold as {product.unit} · {product.stock} available in prototype inventory</p>
        <div className="price-row" style={{ margin: '20px 0' }}><span className="price" style={{ fontSize: 25 }}>{rupees(product.price)}</span><span className="old-price">{rupees(product.originalPrice)}</span></div>
        <button className="btn btn-dark" onClick={add} disabled={!product.stock} data-testid={`button-modal-add-${product.id}`}><ShoppingCart size={17} /> Add to cart</button>
      </div>
    </section>
  </div>;
}

function StorePage() {
  const { products, search } = useStore();
  const [category, setCategory] = useState('All');
  const [detail, setDetail] = useState<Product | null>(null);
  const filtered = products.filter(product => (category === 'All' || product.category === category) && (!search || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(search.toLowerCase())));
  const featured = products.filter(product => product.featured).slice(0, 4);
  return <>
    <main className="page">
      {!search && category === 'All' && <section className="hero">
        <div className="hero-copy"><div className="eyebrow">A little bit of everything</div><h1>Good finds.<br />Everyday prices.</h1><p>Groceries for the week, desk upgrades, thoughtful gifts and small joys — all in one friendly demo shop.</p><a href="#catalog" className="btn btn-primary" data-testid="link-explore-products">Explore the shelves <ArrowRight size={16} /></a></div>
        <div className="hero-art" role="img" aria-label="A curated everyday shopping basket" />
      </section>}
      {!search && <div className="trust-strip">
        <div className="trust-item"><div className="trust-icon"><Truck size={19} /></div><div><strong>Delivery is pretend</strong><span>Checkout is just for the demo</span></div></div>
        <div className="trust-item"><div className="trust-icon"><ShieldCheck size={19} /></div><div><strong>Safe to explore</strong><span>No real payments or accounts</span></div></div>
        <div className="trust-item"><div className="trust-icon"><PackageCheck size={19} /></div><div><strong>{products.length} things to browse</strong><span>Fresh finds across 15 aisles</span></div></div>
      </div>}
      <section id="catalog">
        <div className="section-head"><div><h2>{search ? 'Search results' : category === 'All' ? 'Browse the shelves' : category}</h2><p>{search ? `${filtered.length} items matching “${search}”` : 'A thoughtfully mixed collection for home, work and play.'}</p></div><span className="tiny-note" data-testid="text-product-count">{filtered.length} products</span></div>
        <div className="category-rail" role="group" aria-label="Filter by category">
          {['All', ...categories].map(name => <button key={name} className={`chip ${category === name ? 'active' : ''}`} onClick={() => setCategory(name)} data-testid={`filter-category-${name.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>{name}</button>)}
        </div>
        {filtered.length ? <div className="product-grid">{filtered.map(product => <ProductCard key={product.id} product={product} onOpen={setDetail} />)}</div> : <div className="panel empty-state"><div className="empty-icon"><Search size={22} /></div><h3>No products found</h3><p className="page-subtitle">Try another search or choose a different aisle.</p><button className="btn btn-outline" style={{ marginTop: 16 }} onClick={() => setCategory('All')} data-testid="button-reset-filter">Clear category filter</button></div>}
      </section>
      {!search && category === 'All' && <section>
        <div className="section-head"><div><h2>Little favourites</h2><p>Some good places to start your browsing.</p></div><button className="btn btn-outline" onClick={() => window.scrollTo({ top: 660, behavior: 'smooth' })} data-testid="button-see-all">See all items <ArrowRight size={15} /></button></div>
        <div className="product-grid">{featured.map(product => <ProductCard key={`feat-${product.id}`} product={product} onOpen={setDetail} />)}</div>
      </section>}
    </main>
    {detail && <ProductModal product={detail} close={() => setDetail(null)} />}
  </>;
}

function totalsFor(cart: CartLine[], products: Product[]) {
  const items = cart.map(line => ({ line, product: products.find(p => p.id === line.productId) })).filter((entry): entry is { line: CartLine; product: Product } => Boolean(entry.product));
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.line.quantity, 0);
  const delivery = subtotal === 0 || subtotal >= 999 ? 0 : 49;
  return { items, subtotal, delivery, total: subtotal + delivery };
}

function CartPage() {
  const { cart, setCart, products, setNotice } = useStore();
  const totals = totalsFor(cart, products);
  const adjust = (id: string, delta: number) => {
    const product = products.find(item => item.id === id);
    if (!product) return;
    const line = cart.find(item => item.productId === id);
    if (!line) return;
    if (delta > 0 && line.quantity >= product.stock) {
      setNotice(`Only ${product.stock} ${product.unit} available in the demo inventory.`);
      return;
    }
    setCart(cart.map(item => item.productId === id ? { ...item, quantity: Math.max(1, Math.min(product.stock || 1, item.quantity + delta)) } : item));
  };
  const remove = (id: string) => setCart(cart.filter(line => line.productId !== id));
  return <main className="page">
    <div className="eyebrow">Your basket</div><h1 className="page-title">Shopping cart</h1><p className="page-subtitle">Review your finds before heading to the pretend checkout.</p>
    {totals.items.length === 0 ? <div className="panel empty-state" style={{ marginTop: 24 }}><div className="empty-icon"><ShoppingCart size={23} /></div><h2>Your cart is taking a little break</h2><p className="page-subtitle">Add something from the shelves and it will show up here.</p><Link href="/" className="btn btn-dark" style={{ marginTop: 17 }} data-testid="link-shop-empty">Browse products <ArrowRight size={16} /></Link></div> : <div className="cart-layout">
      <section className="panel">
        <div className="section-head" style={{ margin: '0 0 4px' }}><div><h2 style={{ fontSize: 20 }}>Your items</h2><p>{totals.items.length} different products</p></div></div>
        {totals.items.map(({ line, product }) => <div className="cart-line" key={line.productId} data-testid={`row-cart-${line.productId}`}>
          <img src={product.image} alt={product.name} />
          <div><div className="product-title" style={{ minHeight: 0 }}>{product.name}</div><div className="tiny-note">{product.unit} · {rupees(product.price)} each</div><div className="quantity" style={{ width: 'fit-content', marginTop: 9 }}>
            <button onClick={() => line.quantity > 1 ? adjust(product.id, -1) : remove(product.id)} aria-label="Decrease quantity" data-testid={`button-quantity-minus-${product.id}`}><Minus size={13} /></button><span data-testid={`text-quantity-${product.id}`}>{line.quantity}</span><button onClick={() => adjust(product.id, 1)} aria-label="Increase quantity" disabled={product.stock === 0 || line.quantity >= product.stock} data-testid={`button-quantity-plus-${product.id}`}><Plus size={13} /></button>
          </div></div>
          <div style={{ textAlign: 'right' }}><strong>{rupees(product.price * line.quantity)}</strong><button onClick={() => remove(product.id)} className="btn btn-danger" style={{ display: 'flex', marginTop: 9, padding: '7px 9px', fontSize: 11 }} data-testid={`button-remove-${product.id}`}><Trash2 size={13} /> Remove</button></div>
        </div>)}
      </section>
      <aside className="panel"><h2 style={{ font: '800 19px Manrope', margin: '0 0 12px' }}>Order summary</h2>
        <div className="summary-line"><span>Subtotal</span><strong data-testid="text-cart-subtotal">{rupees(totals.subtotal)}</strong></div>
        <div className="summary-line"><span>Demo delivery</span><strong data-testid="text-cart-delivery">{totals.delivery ? rupees(totals.delivery) : 'Free'}</strong></div>
        <p className="tiny-note">Free simulated delivery on orders over ₹999.</p>
        <div className="summary-line total"><span>Total</span><strong data-testid="text-cart-total">{rupees(totals.total)}</strong></div>
        <Link href="/checkout" className="btn btn-dark" style={{ width: '100%', marginTop: 11 }} data-testid="link-checkout">Continue to checkout <ArrowRight size={16} /></Link>
        <div className="demo-banner" style={{ marginTop: 14 }}>Prototype only. No money is collected and no parcel will be sent.</div>
      </aside>
    </div>}
  </main>;
}

function CheckoutPage() {
  const { cart, setCart, products, user, setOrders, orders, setProducts, setNotice } = useStore();
  const [, navigate] = useLocation();
  const totals = totalsFor(cart, products);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '', address: '', city: '', pincode: '' });
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState<Order | null>(null);
  const change = (key: keyof typeof form, value: string) => setForm({ ...form, [key]: value });
  const placeOrder = (event: FormEvent) => {
    event.preventDefault();
    if (!totals.items.length) { setError('Your cart is empty. Add an item before checkout.'); return; }
    if (totals.items.some(({ line, product }) => line.quantity > product.stock)) { setError('Your cart includes more items than are currently in demo stock. Update quantities before continuing.'); return; }
    if (Object.values(form).some(value => !value.trim())) { setError('Please complete every delivery detail to continue.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('Enter a valid email address for the demo confirmation.'); return; }
    if (!/^\d{6}$/.test(form.pincode)) { setError('Enter a 6-digit Indian PIN code.'); return; }
    if (!/^[0-9+\-\s]{10,15}$/.test(form.phone)) { setError('Enter a phone number between 10 and 15 digits.'); return; }
    const order: Order = {
      id: `SSI-${Date.now().toString().slice(-7)}`, customerName: form.name, email: form.email,
      address: `${form.address}, ${form.city} ${form.pincode}`, items: totals.items.map(({ line, product }) => ({ productId: product.id, name: product.name, price: product.price, quantity: line.quantity, image: product.image, unit: product.unit })),
      subtotal: totals.subtotal, delivery: totals.delivery, total: totals.total, status: 'Confirmed (demo)', createdAt: new Date().toISOString(),
    };
    setOrders([order, ...orders]);
    setProducts(products.map(product => {
      const line = cart.find(item => item.productId === product.id);
      return line ? { ...product, stock: Math.max(0, product.stock - line.quantity) } : product;
    }));
    setCart([]);
    setConfirmation(order);
    setError('');
  };
  if (confirmation) return <main className="page"><section className="panel empty-state" style={{ maxWidth: 700, margin: '30px auto' }}>
    <div className="empty-icon"><Check size={24} /></div><div className="eyebrow">Order simulated</div><h1 className="page-title" style={{ marginTop: 9 }}>You’re all set, {confirmation.customerName.split(' ')[0]}.</h1>
    <p className="page-subtitle">Your pretend order is saved in this browser. Nothing has been charged and nothing will be delivered.</p>
    <div className="order-card" style={{ textAlign: 'left', maxWidth: 450, margin: '24px auto' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Order {confirmation.id}</strong><span className="status-pill">{confirmation.status}</span></div><div className="summary-line"><span>Items</span><strong>{confirmation.items.reduce((n, i) => n + i.quantity, 0)}</strong></div><div className="summary-line total"><span>Demo total</span><strong>{rupees(confirmation.total)}</strong></div><div className="tiny-note">Confirmation for {confirmation.email}</div></div>
    <Link href="/" className="btn btn-dark" data-testid="link-continue-shopping">Continue browsing <ArrowRight size={16} /></Link>
  </section></main>;
  return <main className="page"><div className="eyebrow">Prototype checkout</div><h1 className="page-title">Delivery details</h1><p className="page-subtitle">No payment details needed. Your order is simulated and saved only in this browser.</p>
    {!totals.items.length ? <div className="panel empty-state" style={{ marginTop: 24 }}><div className="empty-icon"><ShoppingCart size={22} /></div><h2>Your cart is empty</h2><Link href="/" className="btn btn-dark" style={{ marginTop: 16 }} data-testid="link-checkout-shop">Browse products</Link></div> : <form onSubmit={placeOrder} className="cart-layout">
      <section className="panel"><div className="demo-banner" style={{ marginBottom: 20 }}><CreditCard size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} /> Checkout is simulated. There is no payment gateway, address service or delivery partner.</div>
        <div className="form-grid">
          <div className="field"><label htmlFor="checkout-name">Full name</label><input id="checkout-name" value={form.name} onChange={e => change('name', e.target.value)} autoComplete="name" data-testid="input-checkout-name" /></div>
          <div className="field"><label htmlFor="checkout-email">Email address</label><input id="checkout-email" type="email" value={form.email} onChange={e => change('email', e.target.value)} autoComplete="email" data-testid="input-checkout-email" /></div>
          <div className="field"><label htmlFor="checkout-phone">Phone number</label><input id="checkout-phone" value={form.phone} onChange={e => change('phone', e.target.value)} autoComplete="tel" data-testid="input-checkout-phone" /></div>
          <div className="field"><label htmlFor="checkout-pin">PIN code</label><input id="checkout-pin" inputMode="numeric" maxLength={6} value={form.pincode} onChange={e => change('pincode', e.target.value)} data-testid="input-checkout-pincode" /></div>
          <div className="field full"><label htmlFor="checkout-address">Street address</label><textarea id="checkout-address" rows={3} value={form.address} onChange={e => change('address', e.target.value)} autoComplete="street-address" data-testid="input-checkout-address" /></div>
          <div className="field full"><label htmlFor="checkout-city">City / town</label><input id="checkout-city" value={form.city} onChange={e => change('city', e.target.value)} autoComplete="address-level2" data-testid="input-checkout-city" /></div>
        </div>
        {error && <div className="error-note" role="alert" data-testid="status-checkout-error">{error}</div>}
      </section>
      <aside className="panel"><h2 style={{ font: '800 19px Manrope', margin: '0 0 13px' }}>Your order</h2>
        {totals.items.map(({ product, line }) => <div className="summary-line" key={product.id}><span>{product.name} × {line.quantity}</span><strong>{rupees(product.price * line.quantity)}</strong></div>)}
        <div className="summary-line"><span>Subtotal</span><strong>{rupees(totals.subtotal)}</strong></div><div className="summary-line"><span>Delivery</span><strong>{totals.delivery ? rupees(totals.delivery) : 'Free'}</strong></div><div className="summary-line total"><span>Total</span><strong data-testid="text-checkout-total">{rupees(totals.total)}</strong></div>
        <button className="btn btn-primary" style={{ width: '100%', marginTop: 12 }} type="submit" data-testid="button-place-order">Place simulated order <ArrowRight size={16} /></button>
        <p className="tiny-note" style={{ lineHeight: 1.55, marginTop: 12 }}>Saved as a demo order for this school presentation. No purchase is made.</p>
      </aside>
    </form>}
  </main>;
}

function AccountPage() {
  const { user, setUser, orders, setNotice } = useStore();
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const update = (key: keyof typeof form, value: string) => setForm({ ...form, [key]: value });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.email.trim() || form.password.length < 4 || (mode === 'signup' && !form.name.trim())) {
      setError(mode === 'signup' ? 'Add your name, email and a password of at least 4 characters.' : 'Enter a username or email and a password of at least 4 characters.');
      return;
    }
    const identity = form.email.trim().toLowerCase();
    const email = identity === 'admin' ? 'admin@simplestores.in' : identity;
    if (mode === 'signin' && email === 'admin@simplestores.in' && form.password === 'admin123') {
      const next = { name: 'Demo Admin', email, role: 'admin' as const };
      setUser(next); setDone(true); setError(''); setNotice('Signed in as the demo admin. Admin tools are simulated.'); return;
    }
    if (mode === 'signin' && identity === 'shopper@simplestores.in' && form.password === 'shop123') {
      const next = { name: 'Aarav Mehta', email, role: 'customer' as const };
      setUser(next); setDone(true); setError(''); setNotice('Signed in as the demo customer.'); return;
    }
    if (mode === 'signup') {
      const next = { name: form.name.trim(), email, role: 'customer' as const };
      setUser(next); setDone(true); setError(''); setNotice('Demo customer profile created on this device.'); return;
    }
    setError('That demo sign-in did not match. Try one of the sample accounts below, or create a demo profile.');
  };
  const signOut = () => { setUser(null); setDone(false); setNotice('You have signed out of the demo account.'); };
  if (user && !done) return <main className="page"><div className="account-wrap">
    <aside className="account-aside"><div className="eyebrow">Your demo account</div><h2>Welcome back, {user.name.split(' ')[0]}.</h2><p>Your profile is stored only in this browser. Explore your saved demo orders below.</p><button className="btn btn-primary" onClick={signOut} data-testid="button-signout">Sign out</button></aside>
    <section className="account-content"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}><div><h1 className="page-title" style={{ fontSize: 25 }}>Account overview</h1><p className="page-subtitle" data-testid="text-account-email">{user.email} · {user.role} demo</p></div>{user.role === 'admin' && <Link className="btn btn-dark" href="/admin" data-testid="link-open-admin">Open admin <ArrowRight size={15} /></Link>}</div>
      <h3 style={{ marginTop: 29 }}>Your orders</h3>{orders.filter(order => order.email.toLowerCase() === user.email.toLowerCase()).length ? orders.filter(order => order.email.toLowerCase() === user.email.toLowerCase()).map(order => <OrderCard order={order} key={order.id} />) : <div className="panel empty-state" style={{ padding: 27 }}><div className="empty-icon"><PackageCheck size={20} /></div><strong>No demo orders yet</strong><p className="tiny-note">A completed simulated checkout will appear here.</p></div>}
    </section></div></main>;
  return <main className="page"><div className="account-wrap">
    <aside className="account-aside"><div className="eyebrow">A tiny prototype account</div><h2>Shopping, without the paperwork.</h2><p>Sign in to see your simulated account, or make a profile for this browser. Nothing is sent to a server.</p><div style={{ marginTop: 28, borderTop: '1px solid #ffffff2b', paddingTop: 18 }}><div style={{ display: 'flex', gap: 10, marginBottom: 12 }}><ShieldCheck size={17} color="#f0b36b" /><span style={{ fontSize: 12 }}>No real authentication</span></div><div style={{ display: 'flex', gap: 10 }}><CreditCard size={17} color="#f0b36b" /><span style={{ fontSize: 12 }}>No payment information collected</span></div></div></aside>
    <section className="account-content"><h1 className="page-title" style={{ fontSize: 25 }}>Your account</h1><p className="page-subtitle">Sign in or create a local demo profile.</p>
      <div className="tab-row" style={{ marginTop: 20 }}><button className={mode === 'signin' ? 'active' : ''} onClick={() => { setMode('signin'); setError(''); }} data-testid="tab-signin">Sign in</button><button className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setError(''); }} data-testid="tab-signup">Create account</button></div>
      {done && user && <div className="notice" data-testid="status-login-success">Signed in as {user.name}. {user.role === 'admin' ? 'Your admin dashboard is ready.' : 'Your customer account is ready.'}<button className="btn btn-outline" style={{ marginLeft: 12, padding: '6px 10px', fontSize: 11 }} onClick={() => user.role === 'admin' ? navigate('/admin') : navigate('/')} data-testid="button-continue-account">{user.role === 'admin' ? 'Open admin' : 'Start browsing'}</button></div>}
      <form onSubmit={submit} className="form-grid" style={{ gridTemplateColumns: '1fr', gap: 12 }}>
        {mode === 'signup' && <div className="field"><label htmlFor="account-name">Your name</label><input id="account-name" value={form.name} onChange={e => update('name', e.target.value)} data-testid="input-account-name" /></div>}
        <div className="field"><label htmlFor="account-email">{mode === 'signin' ? 'Email or username' : 'Email'}</label><input id="account-email" type={mode === 'signup' ? 'email' : 'text'} placeholder={mode === 'signin' ? 'admin or your email' : undefined} autoComplete={mode === 'signin' ? 'username' : 'email'} value={form.email} onChange={e => update('email', e.target.value)} data-testid="input-account-email" /></div>
        <div className="field"><label htmlFor="account-password">Password</label><input id="account-password" type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} value={form.password} onChange={e => update('password', e.target.value)} data-testid="input-account-password" /></div>
        {error && <div className="error-note" role="alert" data-testid="status-account-error">{error}</div>}
        <button type="submit" className="btn btn-dark" data-testid="button-account-submit">{mode === 'signin' ? 'Sign in to demo' : 'Create demo profile'} <ArrowRight size={15} /></button>
      </form>
      <div className="demo-banner" style={{ marginTop: 19 }}><strong>Sample sign-in details</strong><br />Customer: shopper@simplestores.in · shop123<br />Admin: admin · admin123<br /><span>Prototype-only login: credentials are visible in source and are not secure for a real store.</span></div>
    </section>
  </div></main>;
}

function OrderCard({ order }: { order: Order }) {
  return <div className="order-card" data-testid={`card-order-${order.id}`}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}><strong>{order.id}</strong><span className="status-pill">{order.status}</span></div><p className="tiny-note">{new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} · {order.items.length} line items</p><div className="summary-line"><span>{order.items.map(item => `${item.name} × ${item.quantity}`).join(', ')}</span><strong>{rupees(order.total)}</strong></div><p className="tiny-note">{order.customerName} · {order.email} · {order.address}</p></div>;
}

function AdminPage() {
  const { user, products, setProducts, orders } = useStore();
  const [tab, setTab] = useState<'overview' | 'inventory' | 'orders'>('overview');
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: categories[0], price: '', stock: '', unit: '', description: '' });
  const [saved, setSaved] = useState('');
  const [productError, setProductError] = useState('');
  const updateProduct = (id: string, key: 'price' | 'stock', value: string) => setProducts(products.map(product => product.id === id ? { ...product, [key]: Math.max(0, Number(value) || 0), originalPrice: key === 'price' ? Math.max(0, Number(value) || 0) : product.originalPrice } : product));
  const addProduct = (event: FormEvent) => {
    event.preventDefault();
    const price = Number(newProduct.price);
    const stock = Number(newProduct.stock);
    if (!newProduct.name.trim() || !newProduct.price || !Number.isFinite(price) || price <= 0 || newProduct.stock === '' || !Number.isFinite(stock) || stock < 0 || !newProduct.unit.trim() || !newProduct.description.trim()) {
      setProductError('Enter a product name, price above ₹0, stock of 0 or more, unit, and description.');
      return;
    }
    const product: Product = { id: `custom-${Date.now()}`, name: newProduct.name.trim(), category: newProduct.category, price: Number(newProduct.price), originalPrice: Number(newProduct.price), description: newProduct.description.trim(), image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=700', rating: 4.5, ratingCount: 0, stock: Number(newProduct.stock), unit: newProduct.unit, featured: false };
    setProducts([product, ...products]); setNewProduct({ name: '', category: categories[0], price: '', stock: '', unit: '', description: '' }); setProductError(''); setShowForm(false); setSaved('New product added to your browser inventory.');
  };
  if (user?.role !== 'admin') return <main className="page"><section className="panel empty-state" style={{ maxWidth: 680, margin: '25px auto' }}><div className="empty-icon"><ShieldCheck size={23} /></div><div className="eyebrow">Simulated admin area</div><h1 className="page-title" style={{ marginTop: 10 }}>Admin sign-in required</h1><p className="page-subtitle">Use the sample admin account to manage prototype products and inspect locally saved orders. No real staff authentication exists.</p><Link className="btn btn-dark" href="/account" style={{ marginTop: 17 }} data-testid="link-admin-signin">Go to demo sign-in <ArrowRight size={15} /></Link><div className="demo-banner" style={{ marginTop: 18, textAlign: 'left' }}>Admin demo: admin · admin123</div></section></main>;
  return <main className="page"><div className="eyebrow">Browser-only console · signed in as admin</div><h1 className="page-title">Store desk</h1><p className="page-subtitle">Manage a pretend inventory and inspect the sample orders saved on this device.</p>
    <div className="admin-layout">
      <nav className="admin-nav" aria-label="Admin sections">{(['overview', 'inventory', 'orders'] as const).map(item => <button className={tab === item ? 'active' : ''} onClick={() => setTab(item)} key={item} data-testid={`button-admin-${item}`}>{item === 'overview' ? 'Overview' : item === 'inventory' ? 'Inventory' : 'Sample orders'}</button>)}</nav>
      <section>
        {saved && <div className="notice" data-testid="status-admin-saved">{saved}<button onClick={() => setSaved('')} aria-label="Dismiss message" data-testid="button-dismiss-admin-message" style={{ float: 'right', border: 0, background: 'transparent' }}><X size={14} /></button></div>}
        {tab === 'overview' && <>
          <div className="stat-grid"><div className="stat-card"><span>Catalog items</span><strong data-testid="text-admin-product-count">{products.length}</strong></div><div className="stat-card"><span>Demo orders</span><strong data-testid="text-admin-order-count">{orders.length}</strong></div><div className="stat-card"><span>Inventory units</span><strong data-testid="text-admin-stock-count">{products.reduce((sum, product) => sum + product.stock, 0)}</strong></div></div>
          <div className="panel" style={{ marginTop: 16 }}><h2 style={{ font: '800 19px Manrope', margin: '0 0 8px' }}>Prototype, not a real store</h2><p className="page-subtitle">Changes are stored in localStorage on this browser. Product pricing and stock changes update the storefront immediately. Orders are only simulated checkout records; there is no payment or fulfilment system.</p><div style={{ display: 'flex', gap: 10, marginTop: 17, flexWrap: 'wrap' }}><button className="btn btn-dark" onClick={() => setTab('inventory')} data-testid="button-go-inventory"><PackageCheck size={16} /> Manage inventory</button><button className="btn btn-outline" onClick={() => setTab('orders')} data-testid="button-go-orders"><BookOpen size={16} /> Inspect orders</button></div></div>
        </>}
        {tab === 'inventory' && <div className="panel"><div className="section-head" style={{ margin: '0 0 14px' }}><div><h2 style={{ fontSize: 21 }}>Inventory</h2><p>Adjust prices and stock as your demo shop evolves.</p></div><button className="btn btn-primary" onClick={() => setShowForm(!showForm)} data-testid="button-add-product">{showForm ? <X size={16} /> : <Plus size={16} />}{showForm ? 'Close form' : 'Add product'}</button></div>
           {showForm && <form onSubmit={addProduct} className="panel" style={{ background: '#f8f8f5', marginBottom: 17, padding: 16 }}><h3 style={{ margin: '0 0 13px' }}>New product</h3><div className="form-grid">
            <div className="field"><label htmlFor="new-name">Product name</label><input id="new-name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} data-testid="input-new-product-name" /></div>
            <div className="field"><label htmlFor="new-category">Category</label><select id="new-category" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} data-testid="select-new-product-category">{categories.map(category => <option key={category}>{category}</option>)}</select></div>
            <div className="field"><label htmlFor="new-price">Price in ₹</label><input id="new-price" type="number" min="1" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} data-testid="input-new-product-price" /></div>
            <div className="field"><label htmlFor="new-stock">Stock units</label><input id="new-stock" type="number" min="0" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} data-testid="input-new-product-stock" /></div>
            <div className="field"><label htmlFor="new-unit">Unit / label</label><input id="new-unit" placeholder="e.g. 500 g" value={newProduct.unit} onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })} data-testid="input-new-product-unit" /></div>
            <div className="field full"><label htmlFor="new-description">Description</label><input id="new-description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} data-testid="input-new-product-description" /></div>
           </div>{productError && <div className="error-note" role="alert" data-testid="status-new-product-error">{productError}</div>}<button className="btn btn-dark" style={{ marginTop: 13 }} type="submit" data-testid="button-save-product">Save product <Check size={15} /></button></form>}
          <div className="table-wrap"><table className="data-table"><thead><tr><th>Product</th><th>Category</th><th>Price (₹)</th><th>Stock</th></tr></thead><tbody>{products.map(product => <tr key={product.id} data-testid={`row-inventory-${product.id}`}><td><div className="table-product"><img src={product.image} alt="" /><strong>{product.name}</strong></div></td><td>{product.category}</td><td><input aria-label={`${product.name} price`} className="admin-input" type="number" min="0" value={product.price} onChange={e => updateProduct(product.id, 'price', e.target.value)} data-testid={`input-price-${product.id}`} /></td><td><input aria-label={`${product.name} stock`} className="admin-input" type="number" min="0" value={product.stock} onChange={e => updateProduct(product.id, 'stock', e.target.value)} data-testid={`input-stock-${product.id}`} /></td></tr>)}</tbody></table></div>
        </div>}
        {tab === 'orders' && <div className="panel"><div className="section-head" style={{ margin: '0 0 12px' }}><div><h2 style={{ fontSize: 21 }}>Sample orders</h2><p>Simulated checkout records saved on this device only.</p></div><span className="status-pill">{orders.length} orders</span></div>
          {orders.length ? orders.map(order => <OrderCard order={order} key={order.id} />) : <div className="empty-state" style={{ padding: 34 }}><div className="empty-icon"><PackageCheck size={21} /></div><strong>No sample orders yet</strong><p className="page-subtitle">Place a simulated order through checkout and it will appear here.</p></div>}
          <div className="demo-banner" style={{ marginTop: 16 }}>Order status, payments and fulfilment are all simulated prototype data.</div>
        </div>}
      </section>
    </div>
  </main>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return <RoutedErrorBoundary><AppShell /></RoutedErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><StoreProvider><Router /></StoreProvider></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
