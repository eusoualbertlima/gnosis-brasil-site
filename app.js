import { PRODUCTS, STORE_CONFIG } from './products.js'

const state = {
  search: '',
  category: 'Todos',
  cart: loadCart(),
}

const categoryFilters = document.getElementById('category-filters')
const productGrid = document.getElementById('product-grid')
const cartCount = document.getElementById('cart-count')
const cartDrawer = document.getElementById('cart-drawer')
const cartItems = document.getElementById('cart-items')
const summaryItems = document.getElementById('summary-items')
const subtotalEl = document.getElementById('subtotal')
const shippingEl = document.getElementById('shipping')
const totalEl = document.getElementById('total')
const shippingMethodEl = document.getElementById('shipping-method')
const paymentMethodEl = document.getElementById('payment-method')
const pixNoteEl = document.getElementById('pix-note')
const checkoutForm = document.getElementById('checkout-form')
const toastEl = document.getElementById('toast')

function brl(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: STORE_CONFIG.currency }).format(value)
}

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem('gnosis_cart') || '[]')
  } catch {
    return []
  }
}

function saveCart() {
  localStorage.setItem('gnosis_cart', JSON.stringify(state.cart))
}

function categories() {
  return ['Todos', ...new Set(PRODUCTS.map((p) => p.category))]
}

function filteredProducts() {
  return PRODUCTS.filter((item) => {
    const byCategory = state.category === 'Todos' || item.category === state.category
    const bySearch = `${item.name} ${item.description}`.toLowerCase().includes(state.search.toLowerCase())
    return byCategory && bySearch
  })
}

function showToast(message) {
  toastEl.textContent = message
  toastEl.classList.add('show')
  setTimeout(() => toastEl.classList.remove('show'), 1400)
}

function renderCategories() {
  categoryFilters.innerHTML = ''
  categories().forEach((category) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = `chip${state.category === category ? ' active' : ''}`
    button.textContent = category
    button.onclick = () => {
      state.category = category
      renderCategories()
      renderProducts()
    }
    categoryFilters.appendChild(button)
  })
}

function bumpCartButton() {
  cartCount.animate(
    [
      { transform: 'scale(1)' },
      { transform: 'scale(1.2)' },
      { transform: 'scale(1)' },
    ],
    { duration: 260, easing: 'ease' }
  )
}

function addToCart(productId) {
  const existing = state.cart.find((item) => item.id === productId)
  if (existing) {
    existing.qty += 1
  } else {
    state.cart.push({ id: productId, qty: 1 })
  }
  saveCart()
  renderCart()
  bumpCartButton()
  showToast('Item adicionado ao carrinho')
}

function updateQty(productId, delta) {
  const entry = state.cart.find((item) => item.id === productId)
  if (!entry) return
  entry.qty += delta
  if (entry.qty <= 0) {
    state.cart = state.cart.filter((item) => item.id !== productId)
  }
  saveCart()
  renderCart()
}

function clearCart() {
  state.cart = []
  saveCart()
  renderCart()
  showToast('Carrinho limpo')
}

function renderProducts() {
  const items = filteredProducts()
  productGrid.innerHTML = ''

  if (!items.length) {
    productGrid.innerHTML = '<p>Nenhum produto encontrado.</p>'
    return
  }

  items.forEach((item) => {
    const article = document.createElement('article')
    article.className = 'product-card'
    article.innerHTML = `
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <span class="tag">${item.category}</span>
      <div class="product-meta">
        <strong class="price">${brl(item.price)}</strong>
        <button type="button" class="button">Adicionar</button>
      </div>
    `
    article.querySelector('button').onclick = () => addToCart(item.id)
    productGrid.appendChild(article)
  })
}

function cartDetailed() {
  return state.cart.map((entry) => {
    const product = PRODUCTS.find((item) => item.id === entry.id)
    return {
      ...entry,
      name: product.name,
      price: product.price,
      line: product.price * entry.qty,
    }
  })
}

function currentShipping() {
  const selected = shippingMethodEl.value || STORE_CONFIG.shippingMethods[0].id
  return STORE_CONFIG.shippingMethods.find((s) => s.id === selected) || STORE_CONFIG.shippingMethods[0]
}

function renderCart() {
  const lines = cartDetailed()
  const subtotal = lines.reduce((acc, cur) => acc + cur.line, 0)
  const shipping = lines.length ? currentShipping().price : 0
  const total = subtotal + shipping

  cartCount.textContent = String(lines.reduce((acc, cur) => acc + cur.qty, 0))
  cartItems.innerHTML = ''
  summaryItems.innerHTML = ''

  if (!lines.length) {
    cartItems.innerHTML = '<p>Carrinho vazio.</p>'
    summaryItems.innerHTML = '<p>Sem itens.</p>'
  }

  lines.forEach((line) => {
    const cartEl = document.createElement('article')
    cartEl.className = 'cart-item'
    cartEl.innerHTML = `
      <div class="cart-item-head"><strong>${line.name}</strong><span>${brl(line.line)}</span></div>
      <div class="cart-item-actions">
        <button type="button" class="small-btn" data-action="minus">-</button>
        <span>${line.qty}</span>
        <button type="button" class="small-btn" data-action="plus">+</button>
        <button type="button" class="small-btn danger" data-action="remove">Remover</button>
      </div>
    `
    cartEl.querySelector('[data-action="minus"]').onclick = () => updateQty(line.id, -1)
    cartEl.querySelector('[data-action="plus"]').onclick = () => updateQty(line.id, 1)
    cartEl.querySelector('[data-action="remove"]').onclick = () => updateQty(line.id, -line.qty)
    cartItems.appendChild(cartEl)

    const summaryLine = document.createElement('div')
    summaryLine.className = 'summary-row'
    summaryLine.innerHTML = `<span>${line.qty}x ${line.name}</span><span>${brl(line.line)}</span>`
    summaryItems.appendChild(summaryLine)
  })

  subtotalEl.textContent = brl(subtotal)
  shippingEl.textContent = brl(shipping)
  totalEl.textContent = brl(total)
  pixNoteEl.textContent = `Pix para pagamento: ${STORE_CONFIG.pixKey}`
}

function renderConfig() {
  shippingMethodEl.innerHTML = STORE_CONFIG.shippingMethods.map((method) => `
    <option value="${method.id}">${method.name} (${brl(method.price)})</option>
  `).join('')

  paymentMethodEl.innerHTML = STORE_CONFIG.paymentMethods.map((method) => `
    <option value="${method.id}">${method.name}</option>
  `).join('')
}

function openCart(open) {
  cartDrawer.classList.toggle('open', open)
  cartDrawer.setAttribute('aria-hidden', String(!open))
}

function checkoutMessage(data) {
  const lines = cartDetailed()
  const subtotal = lines.reduce((acc, cur) => acc + cur.line, 0)
  const shipping = currentShipping().price
  const total = subtotal + shipping
  const orderCode = `GB-${Date.now()}`

  const productsText = lines.map((line) => `- ${line.qty}x ${line.name} (${brl(line.line)})`).join('%0A')
  const paymentName = STORE_CONFIG.paymentMethods.find((method) => method.id === data.paymentMethod)?.name || data.paymentMethod
  const shippingName = currentShipping().name

  return [
    '*Pedido Loja Instituto Gnosis Brasil*',
    `Codigo: ${orderCode}`,
    '',
    `Cliente: ${data.customerName}`,
    `WhatsApp: ${data.customerPhone}`,
    `Cidade/UF: ${data.customerCity}`,
    '',
    'Itens:',
    productsText,
    '',
    `Subtotal: ${brl(subtotal)}`,
    `Frete: ${brl(shipping)} (${shippingName})`,
    `Total: ${brl(total)}`,
    `Pagamento: ${paymentName}`,
    `Chave Pix: ${STORE_CONFIG.pixKey}`,
    '',
    `Observacoes: ${data.notes || 'Sem observacoes'}`,
  ].join('%0A')
}

function setupReveal() {
  const revealEls = document.querySelectorAll('[data-reveal]')
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('in-view')
    })
  }, { threshold: 0.12 })

  revealEls.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index * 35, 280)}ms`
    observer.observe(el)
  })
}

function setupMenuToggle() {
  const toggle = document.getElementById('menu-toggle')
  const links = document.getElementById('top-links')

  toggle.onclick = () => {
    const open = links.classList.toggle('open')
    toggle.setAttribute('aria-expanded', String(open))
  }

  links.querySelectorAll('a').forEach((link) => {
    link.onclick = () => {
      links.classList.remove('open')
      toggle.setAttribute('aria-expanded', 'false')
    }
  })
}

function setupEvents() {
  document.getElementById('search').addEventListener('input', (event) => {
    state.search = event.target.value
    renderProducts()
  })

  document.getElementById('open-cart').onclick = () => openCart(true)
  document.getElementById('close-cart').onclick = () => openCart(false)
  document.getElementById('clear-cart').onclick = clearCart
  document.getElementById('go-checkout').onclick = () => openCart(false)

  shippingMethodEl.onchange = renderCart

  checkoutForm.onsubmit = (event) => {
    event.preventDefault()
    if (!state.cart.length) {
      showToast('Adicione itens no carrinho antes de finalizar')
      return
    }

    const formData = Object.fromEntries(new FormData(checkoutForm).entries())
    const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${checkoutMessage(formData)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

function init() {
  renderConfig()
  renderCategories()
  renderProducts()
  renderCart()
  setupEvents()
  setupReveal()
  setupMenuToggle()
}

init()
