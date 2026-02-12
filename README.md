# Lumisial Kefren - Loja Online

Site institucional e comercial multipagina, com foco em venda online.

## Estrutura
- `index.html`: home e destaques
- `loja/index.html`: catalogo geral
- `loja/tarot.html`, `loja/salmerio.html`, `loja/essencias.html`: subpaginas de categoria
- `loja/produto.html`: pagina de produto por query string (`?slug=`)
- `checkout.html`: carrinho + fechamento de pedido
- `sobre.html` e `contato.html`: paginas institucionais

## Configuracao da loja
Edite `assets/js/data.js`:
- `STORE.whatsapp`
- `STORE.pixKey`
- `STORE.shipping`
- `PRODUCTS`

## Checkout
Pedido final enviado para WhatsApp com:
- dados do cliente
- itens e quantidades
- subtotal, frete e total
- forma de pagamento
