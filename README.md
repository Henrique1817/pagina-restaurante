# 🍔 Landing Page Restaurante — Pedido em 60s no WhatsApp

Landing page estática ultra rápida de página única para restaurantes de bairro (hamburguerias, pizzarias, marmitarias, açaiterias ou japonês), focada em converter visitantes em clientes no WhatsApp em menos de 60 segundos, sem passar pelo iFood ou qualquer aplicativo intermediário.

---

## 📑 As 12 Seções (Na Ordem Exata)

1. **Barra de Urgência com Campanha e Contador Inteligente:**
   - Nunca exibe horas acima de 24h.
   - Mais de 1 dia restante: exibe dias e horas (`3d 04h 12m`).
   - Menos de 24 horas: exibe horas, minutos e segundos (`04h 12m 35s`).
   - Após a data: esconde a barra inteira em vez de reiniciar ou zerar.
2. **Cabeçalho Fixo:** Logo, link âncora para o cardápio, status em tempo real da loja (Aberto/Fechado) e carrinho com contador de itens e total formatado.
3. **Dobra Principal (Hero):**
   - Título com o benefício central.
   - Subtítulo: *"Pede direto no WhatsApp, sem taxa de aplicativo"*.
   - Dois botões de ação: `Ver Cardápio` e `Falar no WhatsApp`.
   - Foto grande do prato principal.
   - Prova social da Nota do Google (renderiza **apenas com dados reais** fornecidos pelo cliente).
4. **Combos em Destaque:** 3 a 4 cards com preço antigo riscado, lista de itens inclusos com marcadores e botão direto de adicionar.
5. **Diferenciais:** 4 itens curtos e concretos (carne fresca, pão selado na manteiga, embalagem térmica, direto com a cozinha).
6. **Cardápio Completo:** Filtrado por categorias com **busca por nome e descrição em tempo real**.
7. **Avaliações Reais:** Depoimentos reais de clientes do bairro (ocultado automaticamente se não houver dados reais fornecidos).
8. **Entrega e Retirada:** Endereço físico com link do Google Maps, tempo médio de entrega, raio de atendimento e opção de retirada no balcão sem taxa.
9. **Perguntas Frequentes (FAQ):** Accordion semântico e acessível via `<details><summary>`.
10. **Fechamento:** Chamada final para ação com botão de destaque para o WhatsApp.
11. **Rodapé:** Endereço completo, tabela de horários de funcionamento, telefone e Instagram.
12. **Elementos Flutuantes e Mobile:**
    - Botão flutuante direto do WhatsApp fixado no canto inferior direito.
    - No celular (telas < 769px), **barra inferior fixa** com quantidade, total e botão `Ver Pedido 🛒`.

---

## 💬 Formato da Mensagem no WhatsApp

A mensagem é formatada para ser extremamente limpa e legível na tela do celular do dono do restaurante:

```text
*Novo pedido — Brava Smash Burger*
Cliente: João da Silva
Entrega em: Rua Augusta, 1200 — apto 42 (Consolação)
Pagamento: Pix
Itens:
2x Brava Double Smash — R$ 69,80
1x Batata Rústica — R$ 18,00
1x Coca-Cola Original 350ml — R$ 7,00
Subtotal: R$ 94,80
Taxa de entrega: GRÁTIS
*Total: R$ 94,80*
Obs: sem cebola e maionese à parte
```

*(Se o cliente selecionar Retirada no Balcão, a linha de endereço vira: `Retirada no balcão: Rua Harmonia, 382 (Vila Madalena)`).*

---

## ⚙️ Onde Trocar Cada Dado (`js/config.js`)

Todo dado do negócio é alterado exclusivamente no arquivo [`js/config.js`](file:///c:/Users/FOUR%20MED/OneDrive/restaurant-model/js/config.js):

| Dado | Campo no `RESTAURANTE_CONFIG` | Descrição |
|---|---|---|
| Nome do restaurante | `nome` e `nomeCurto` | Nome completo e versão reduzida para o topo |
| Telefone e WhatsApp | `whatsappNumber` e `whatsappDisplay` | `55DDDNUMERO` (sem traços) e versão formatada |
| Endereço e Cidade | `endereco`, `bairro`, `cidadeUF` | Endereço da loja física para entrega/retirada |
| Google Maps | `googleMapsLink` | Link para traçar rota no Maps |
| Instagram | `instagram` e `instagramLink` | @ do perfil e link direto |
| Horários | `horarios` | Horário de abertura e fechamento por dia da semana (0 = Dom a 6 = Sáb) |
| Entrega | `tempoMedioEntrega`, `raioEntrega`, `taxaEntregaPadrao`, `freteGratisAcima` | Tempos e políticas de frete |
| Campanha e Cupom | `campanha` | Ativação, nome, cupom, % de desconto e data limite ISO (`YYYY-MM-DDTHH:mm:ss-03:00`) |
| Combos em destaque | `combosDestaque` | Cards principais com preço antigo, atual e itens inclusos |
| Produtos do cardápio | `produtos` | Lista de hambúrgueres, porções, bebidas e sobremesas |
| Prova social | `notaGoogle`, `avaliacoesCount`, `avaliacoes` | Nota, contagem real e depoimentos autorizados |
| Dúvidas | `faq` | Perguntas e respostas do accordion |

---

## 📋 Lista do que Depende do Cliente (Checklist de Entrega)

Para colocar a página no ar para um novo cliente, colete os seguintes itens:

1. **Número Oficial do WhatsApp:** Número ativo com DDD (ex: `5511998765432`) que receberá os pedidos.
2. **Cardápio e Preços Atualizados:**
   - Nomes, descrições dos ingredientes e preços vigentes.
   - Definição dos 3 a 4 Combos principais.
3. **Fotos dos Produtos:**
   - Substituir as imagens de exemplo em `img/` pelas fotos reais dos pratos do restaurante em WebP.
4. **Horários de Funcionamento:**
   - Dias em que abre e fecha, e horários exatos de início e fim.
5. **Políticas de Entrega:**
   - Bairros ou raio em km atendidos, taxa cobrada e valor para frete grátis.
6. **Formas de Pagamento Aceitas:**
   - Chave Pix do estabelecimento, cartões aceitos na maquininha móvel.
7. **Nota do Google e Avaliações Reais (Opcional):**
   - Nota real (ex: `4.9`), número de avaliações e depoimentos com autorização do cliente. Se o restaurante for novo e não tiver, deixe `null` e `[]` no config.

---

## ⚡ Qualidade e Performance

- **Funciona sem JavaScript:** O nome do restaurante, dados essenciais, cardápio e botão de WhatsApp continuam visíveis mesmo se o JavaScript for desativado.
- **Lighthouse Mobile > 90:** Zero recursos bloqueantes de terceiros, zero dependências externas em tempo de execução, imagens em WebP com `width` e `height` definidos (zero CLS).
- **Acessibilidade:** Suporte completo a `:focus-visible`, contraste em padrão **WCAG AA** e respeito à preferência `prefers-reduced-motion`.
- **Testado em diferentes resoluções:**
  - 360px (mobile compacto)
  - 390px (iPhone padrão)
  - 768px (tablets / iPads)
  - 1440px (desktop e telas ultrawide)

---

## 🚀 Como Publicar na Vercel

Por ser um projeto puramente estático, a publicação leva menos de 1 minuto:

1. Suba o repositório no seu GitHub/GitLab.
2. Acesse [vercel.com](https://vercel.com) e clique em **Add New Project**.
3. Selecione o repositório `pagina-restaurante`.
4. Deixe a opção de framework como **Other** (Root Directory `./`).
5. Clique em **Deploy**. O site estará publicado com HTTPS ativo, CDN global e cabeçalhos de cache otimizados pelo arquivo [`vercel.json`](file:///c:/Users/FOUR%20MED/OneDrive/restaurant-model/vercel.json).
