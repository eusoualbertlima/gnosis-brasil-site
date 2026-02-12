export const STORE = {
  name: 'Lumisial Kefren',
  whatsapp: '5511999999999',
  pixKey: 'financeiro@lumisialkefren.com',
  shipping: [
    { id: 'retirada', label: 'Retirada local', value: 0 },
    { id: 'padrao', label: 'Entrega padrao', value: 18.9 },
    { id: 'expresso', label: 'Entrega expressa', value: 29.9 }
  ],
  payment: [
    { id: 'pix', label: 'Pix' },
    { id: 'cartao', label: 'Cartao de credito' },
    { id: 'boleto', label: 'Boleto' }
  ]
}

export const PRODUCTS = [
  {
    slug: 'tarot-arcano-lumisial',
    name: 'Tarot Arcano Lumisial',
    category: 'tarot',
    short: 'Baralho autoral para leitura simbolica e meditativa.',
    description: 'Conjunto completo com 78 cartas, guia introdutorio e acabamento premium para estudo continuo.',
    price: 169.9,
    highlight: true
  },
  {
    slug: 'tarot-iniciatico-kefren',
    name: 'Tarot Iniciatico Kefren',
    category: 'tarot',
    short: 'Edicao para estudos iniciantes e praticas guiadas.',
    description: 'Ideal para quem deseja iniciar com clareza, metodo e simbolismo essencial.',
    price: 139.9,
    highlight: false
  },
  {
    slug: 'salmerio-edicao-classica',
    name: 'Salmerio Edicao Classica',
    category: 'salmerio',
    short: 'Texto base para praticas de vocalizacao e contemplacao.',
    description: 'Impresso em alta legibilidade, capa resistente e organizacao por ciclos de pratica.',
    price: 72.9,
    highlight: true
  },
  {
    slug: 'salmerio-bolso',
    name: 'Salmerio de Bolso',
    category: 'salmerio',
    short: 'Formato compacto para rotina diaria.',
    description: 'Versao leve com selecao essencial para uso em deslocamento e encontros.',
    price: 49.9,
    highlight: false
  },
  {
    slug: 'essencia-lotus-azul',
    name: 'Essencia Lotus Azul',
    category: 'essencias',
    short: 'Aroma para concentracao e serenidade.',
    description: 'Frasco 30ml com blend exclusivo para ambiente de estudo e meditacao.',
    price: 44.9,
    highlight: true
  },
  {
    slug: 'essencia-mirra-dourada',
    name: 'Essencia Mirra Dourada',
    category: 'essencias',
    short: 'Notas quentes para harmonizacao ritualistica.',
    description: 'Composicao suave para preparacao de praticas e alinhamento do espaco.',
    price: 46.9,
    highlight: false
  },
  {
    slug: 'kit-estudo-lumisial',
    name: 'Kit Estudo Lumisial',
    category: 'kits',
    short: 'Tarot + Salmerio + Essencia em condicao especial.',
    description: 'Kit recomendado para iniciar a trilha com materiais integrados de pratica.',
    price: 259.9,
    highlight: true
  }
]

export const CATEGORIES = [
  { id: 'tarot', label: 'Tarot' },
  { id: 'salmerio', label: 'Salmerio' },
  { id: 'essencias', label: 'Essencias' },
  { id: 'kits', label: 'Kits' }
]
