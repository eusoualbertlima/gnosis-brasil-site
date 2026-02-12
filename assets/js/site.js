import { CATEGORIES, PRODUCTS, STORE } from './data.js'

const money = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

const cartKey = 'lumisial_cart'
const cart = JSON.parse(localStorage.getItem(cartKey) || '[]')

function saveCart() {
  localStorage.setItem(cartKey, JSON.stringify(cart))
}

function bySlug(slug) {
  return PRODUCTS.find((p) => p.slug === slug)
}

function addToCart(slug) {
  const existing = cart.find((c) => c.slug === slug)
  if (existing) existing.qty += 1
  else cart.push({ slug, qty: 1 })
  saveCart()
  updateBadges()
  toast('Item adicionado ao carrinho')
}

function removeFromCart(slug) {
  const idx = cart.findIndex((c) => c.slug === slug)
  if (idx >= 0) cart.splice(idx, 1)
  saveCart()
  updateBadges()
  renderCheckoutSummary()
}

function setQty(slug, delta) {
  const item = cart.find((c) => c.slug === slug)
  if (!item) return
  item.qty += delta
  if (item.qty <= 0) removeFromCart(slug)
  saveCart()
  updateBadges()
  renderCheckoutSummary()
}

function updateBadges() {
  const total = cart.reduce((acc, cur) => acc + cur.qty, 0)
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = String(total)
  })
}

function toast(message) {
  const el = document.getElementById('toast')
  if (!el) return
  el.textContent = message
  el.classList.add('show')
  setTimeout(() => el.classList.remove('show'), 1400)
}

function productCard(product, depth = 0) {
  const prefix = depth === 0 ? '' : '../'
  return `
    <article class="product">
      <h3>${product.name}</h3>
      <p class="page-subtitle">${product.short}</p>
      <span class="tag">${labelCategory(product.category)}</span>
      <div class="meta">
        <strong class="price">${money(product.price)}</strong>
        <div style="display:flex;gap:6px;">
          <a class="btn btn-ghost" href="${prefix}loja/produto.html?slug=${product.slug}">Ver</a>
          <button class="btn btn-primary" data-add="${product.slug}">Adicionar</button>
        </div>
      </div>
    </article>
  `
}

function labelCategory(id) {
  return CATEGORIES.find((c) => c.id === id)?.label || id
}

function renderProductGrid() {
  const grid = document.getElementById('product-grid')
  if (!grid) return

  const category = grid.dataset.category
  const highlight = grid.dataset.highlight === 'true'
  const depth = Number(grid.dataset.depth || '0')

  let list = [...PRODUCTS]
  if (category) list = list.filter((p) => p.category === category)
  if (highlight) list = list.filter((p) => p.highlight)

  grid.innerHTML = list.map((p) => productCard(p, depth)).join('')
  grid.querySelectorAll('[data-add]').forEach((btn) => {
    btn.addEventListener('click', () => addToCart(btn.getAttribute('data-add')))
  })
}

function renderCategoryFilters() {
  const wrap = document.getElementById('category-filters')
  const grid = document.getElementById('product-grid')
  if (!wrap || !grid) return

  let active = 'todos'
  const entries = [{ id: 'todos', label: 'Todos' }, ...CATEGORIES]

  const paint = () => {
    wrap.innerHTML = entries.map((c) => `<button class="chip ${active === c.id ? 'active' : ''}" data-cat="${c.id}">${c.label}</button>`).join('')
    const depth = Number(grid.dataset.depth || '0')
    const filtered = active === 'todos' ? PRODUCTS : PRODUCTS.filter((p) => p.category === active)
    grid.innerHTML = filtered.map((p) => productCard(p, depth)).join('')
    grid.querySelectorAll('[data-add]').forEach((btn) => btn.addEventListener('click', () => addToCart(btn.getAttribute('data-add'))))
    wrap.querySelectorAll('[data-cat]').forEach((btn) => btn.addEventListener('click', () => {
      active = btn.getAttribute('data-cat')
      paint()
    }))
  }

  paint()
}

function renderProductDetail() {
  const root = document.getElementById('product-detail')
  if (!root) return
  const params = new URLSearchParams(window.location.search)
  const slug = params.get('slug')
  const item = bySlug(slug) || PRODUCTS[0]

  root.innerHTML = `
    <h1 class="page-title">${item.name}</h1>
    <p class="page-subtitle">${item.description}</p>
    <div class="panel" style="margin-top:14px;display:grid;gap:10px;">
      <span class="tag">Categoria: ${labelCategory(item.category)}</span>
      <strong class="price" style="font-size:1.2rem;">${money(item.price)}</strong>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn btn-primary" id="add-detail">Adicionar ao carrinho</button>
        <a class="btn btn-ghost" href="index.html">Voltar para loja</a>
      </div>
    </div>
  `

  document.getElementById('add-detail').addEventListener('click', () => addToCart(item.slug))
}

function buildCheckoutSummaryLines() {
  return cart.map((row) => {
    const p = bySlug(row.slug)
    return { ...row, product: p, line: p.price * row.qty }
  })
}

function currentShipping() {
  const select = document.getElementById('shipping-method')
  if (!select) return STORE.shipping[0]
  return STORE.shipping.find((s) => s.id === select.value) || STORE.shipping[0]
}

function renderCheckoutSummary() {
  const root = document.getElementById('summary-items')
  if (!root) return

  const lines = buildCheckoutSummaryLines()
  root.innerHTML = ''

  if (!lines.length) {
    root.innerHTML = '<p class="page-subtitle">Sem itens no carrinho.</p>'
  }

  lines.forEach((line) => {
    const row = document.createElement('div')
    row.className = 'summary-line'
    row.innerHTML = `<span>${line.qty}x ${line.product.name}</span><strong>${money(line.line)}</strong>`
    root.appendChild(row)
  })

  const subtotal = lines.reduce((acc, cur) => acc + cur.line, 0)
  const freight = lines.length ? currentShipping().value : 0
  const total = subtotal + freight

  const subtotalEl = document.getElementById('subtotal')
  const shippingEl = document.getElementById('shipping')
  const totalEl = document.getElementById('total')
  const pixEl = document.getElementById('pix-key')

  if (subtotalEl) subtotalEl.textContent = money(subtotal)
  if (shippingEl) shippingEl.textContent = money(freight)
  if (totalEl) totalEl.textContent = money(total)
  if (pixEl) pixEl.textContent = STORE.pixKey
}

function renderCheckoutFormConfig() {
  const shipping = document.getElementById('shipping-method')
  const payment = document.getElementById('payment-method')
  if (!shipping || !payment) return

  shipping.innerHTML = STORE.shipping.map((s) => `<option value="${s.id}">${s.label} (${money(s.value)})</option>`).join('')
  payment.innerHTML = STORE.payment.map((p) => `<option value="${p.id}">${p.label}</option>`).join('')

  shipping.addEventListener('change', renderCheckoutSummary)
}

function setupCheckoutSubmit() {
  const form = document.getElementById('checkout-form')
  if (!form) return

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    if (!cart.length) {
      toast('Adicione ao menos um item no carrinho')
      return
    }

    const data = Object.fromEntries(new FormData(form).entries())
    const lines = buildCheckoutSummaryLines()
    const subtotal = lines.reduce((acc, cur) => acc + cur.line, 0)
    const freight = currentShipping().value
    const total = subtotal + freight
    const shippingLabel = currentShipping().label
    const paymentLabel = STORE.payment.find((p) => p.id === data.paymentMethod)?.label || data.paymentMethod
    const orderId = `LK-${Date.now()}`

    const items = lines.map((l) => `- ${l.qty}x ${l.product.name} (${money(l.line)})`).join('%0A')

    const text = [
      '*Pedido Loja Lumisial Kefren*',
      `Codigo: ${orderId}`,
      '',
      `Cliente: ${data.customerName}`,
      `WhatsApp: ${data.customerPhone}`,
      `Cidade/UF: ${data.customerCity}`,
      '',
      'Itens:',
      items,
      '',
      `Subtotal: ${money(subtotal)}`,
      `Frete: ${money(freight)} (${shippingLabel})`,
      `Total: ${money(total)}`,
      `Pagamento: ${paymentLabel}`,
      `Chave Pix: ${STORE.pixKey}`,
      `Observacoes: ${data.notes || 'Sem observacoes'}`
    ].join('%0A')

    window.open(`https://wa.me/${STORE.whatsapp}?text=${text}`, '_blank', 'noopener,noreferrer')
  })
}

function setupCartPage() {
  const root = document.getElementById('cart-items')
  if (!root) return

  const paint = () => {
    const lines = buildCheckoutSummaryLines()
    root.innerHTML = lines.map((line) => `
      <article class="card" style="display:grid;gap:8px;">
        <strong>${line.product.name}</strong>
        <span class="page-subtitle">${money(line.product.price)} cada</span>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
          <button class="btn btn-ghost" data-minus="${line.product.slug}">-</button>
          <span>${line.qty}</span>
          <button class="btn btn-ghost" data-plus="${line.product.slug}">+</button>
          <button class="btn btn-ghost" data-remove="${line.product.slug}">Remover</button>
        </div>
      </article>
    `).join('')

    if (!lines.length) root.innerHTML = '<p class="page-subtitle">Seu carrinho esta vazio.</p>'

    root.querySelectorAll('[data-minus]').forEach((b) => b.addEventListener('click', () => { setQty(b.getAttribute('data-minus'), -1); paint(); }))
    root.querySelectorAll('[data-plus]').forEach((b) => b.addEventListener('click', () => { setQty(b.getAttribute('data-plus'), 1); paint(); }))
    root.querySelectorAll('[data-remove]').forEach((b) => b.addEventListener('click', () => { removeFromCart(b.getAttribute('data-remove')); paint(); }))

    renderCheckoutSummary()
  }

  paint()
}

function init() {
  updateBadges()
  renderProductGrid()
  renderCategoryFilters()
  renderProductDetail()
  renderCheckoutFormConfig()
  renderCheckoutSummary()
  setupCheckoutSubmit()
  setupCartPage()

  const clearBtn = document.getElementById('clear-cart')
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      cart.splice(0, cart.length)
      saveCart()
      updateBadges()
      renderCheckoutSummary()
      setupCartPage()
      toast('Carrinho limpo')
    })
  }
}

init()
