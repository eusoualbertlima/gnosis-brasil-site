export const STORE_CONFIG = {
  currency: 'BRL',
  whatsappNumber: '5511999999999',
  pixKey: 'instituto@gnosisbrasil.org',
  shippingMethods: [
    { id: 'retirada', name: 'Retirada no local', price: 0 },
    { id: 'correios', name: 'Envio Correios (estimado)', price: 22.9 },
    { id: 'motoboy', name: 'Entrega local (motoboy)', price: 15 }
  ],
  paymentMethods: [
    { id: 'pix', name: 'Pix' },
    { id: 'cartao', name: 'Cartao de credito' },
    { id: 'dinheiro', name: 'Dinheiro na entrega' }
  ]
}

export const PRODUCTS = [
  {
    id: 'tarot-egipcio',
    name: 'Tarot Egipcio Gnostico',
    category: 'Tarot',
    description: 'Baralho para estudo simbolico e praticas orientadas.',
    price: 149.9
  },
  {
    id: 'salterio-gnostico',
    name: 'Salterio Gnostico',
    category: 'Livros',
    description: 'Edicao de apoio para estudos e praticas devocionais.',
    price: 64.9
  },
  {
    id: 'essencia-lotus',
    name: 'Essencia Lotus',
    category: 'Essencias',
    description: 'Essencia aromatica para praticas de concentracao.',
    price: 39.9
  },
  {
    id: 'incenso-templo',
    name: 'Incenso Templo',
    category: 'Essencias',
    description: 'Incenso ritual para harmonizacao de ambiente.',
    price: 24.9
  },
  {
    id: 'livro-revolucao',
    name: 'Livro Revolucao da Dialetica',
    category: 'Livros',
    description: 'Obra para aprofundamento teorico e pratico.',
    price: 59.9
  },
  {
    id: 'medalhao-gnosis',
    name: 'Medalhao Gnosis',
    category: 'Acessorios',
    description: 'Peca simbolica em metal com acabamento dourado.',
    price: 89.9
  }
]
