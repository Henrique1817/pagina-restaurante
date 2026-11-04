/**
 * ============================================================================
 * App.js - Lógica Dinâmica, Carrinho e Mensagem Padronizada do WhatsApp
 * ============================================================================
 * Implementa as 12 seções em ordem estrita.
 * O essencial funciona mesmo se o JavaScript falhar.
 * Suporta busca por nome, filtros de categorias, contador de urgência inteligente,
 * carrinho em memória + localStorage, e mensagem de WhatsApp limpa para o dono.
 * ============================================================================
 */

(function () {
  'use strict';

  if (typeof RESTAURANTE_CONFIG === 'undefined') {
    console.warn('RESTAURANTE_CONFIG não encontrado. Usando fallbacks em HTML.');
    return;
  }

  const CONFIG = RESTAURANTE_CONFIG;

  // Estado da Aplicação
  const State = {
    cart: [], // Array de { id, qty, obs }
    deliveryType: 'entrega', // 'entrega' ou 'retirada'
    selectedCategory: 'Todos',
    searchQuery: '',
    customer: {
      nome: '',
      telefone: '',
      rua: '',
      numero: '',
      bairro: '',
      complemento: '',
      pagamento: 'pix', // 'pix', 'cartao', 'dinheiro'
      trocoPara: '',
      observacaoGeral: ''
    },
    isCartOpen: false,
    timerInterval: null
  };

  // Utilitários de Formatação
  function formatMoney(val) {
    return Number(val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function sanitize(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Persistência em localStorage
  function loadPersistedData() {
    try {
      const savedCust = localStorage.getItem('restaurante_customer_v2');
      if (savedCust) {
        State.customer = { ...State.customer, ...JSON.parse(savedCust) };
      }
      const savedCart = localStorage.getItem('restaurante_cart_v2');
      if (savedCart) {
        State.cart = JSON.parse(savedCart);
      }
    } catch (e) {
      console.warn('Erro ao ler localStorage:', e);
    }
  }

  function persistData() {
    try {
      localStorage.setItem('restaurante_customer_v2', JSON.stringify(State.customer));
      localStorage.setItem('restaurante_cart_v2', JSON.stringify(State.cart));
    } catch (e) {
      // Ignora falhas em modo privado
    }
  }

  // Notificação Toast
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `<span>✓</span> <span>${sanitize(message)}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 2600);
  }

  // Status da Loja (Aberto/Fechado)
  function getStoreStatus() {
    const now = new Date();
    const day = now.getDay();
    const cfg = CONFIG.horarios && CONFIG.horarios[day];

    if (!cfg || !cfg.aberto || !cfg.inicio || !cfg.fim) {
      return {
        isOpen: false,
        text: 'Fechado agora',
        detail: cfg ? cfg.label : 'Fechado'
      };
    }

    const [startH, startM] = cfg.inicio.split(':').map(Number);
    const [endH, endM] = cfg.fim.split(':').map(Number);
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const startMin = startH * 60 + startM;
    let endMin = endH * 60 + endM;
    if (endMin < startMin) endMin += 24 * 60; // Passa da meia-noite

    if (nowMin >= startMin && nowMin <= endMin) {
      return {
        isOpen: true,
        text: 'Aberto agora',
        detail: `Fecha às ${cfg.fim}`
      };
    }
    return {
      isOpen: false,
      text: 'Fechado agora',
      detail: `Abre às ${cfg.inicio}`
    };
  }

  // ==========================================================================
  // 1. BARRA DE URGÊNCIA COM CONTADOR INTELIGENTE
  // ==========================================================================
  function initUrgencyBar() {
    const el = document.getElementById('urgency-bar');
    if (!el) return;

    if (!CONFIG.campanha || !CONFIG.campanha.ativa || !CONFIG.campanha.dataFimISO) {
      el.hidden = true;
      el.style.display = 'none';
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const target = new Date(CONFIG.campanha.dataFimISO).getTime();
      const diff = target - now;

      // Se a data já passou, esconde a barra inteira (nunca reinicia ou mostra zeros)
      if (isNaN(diff) || diff <= 0) {
        el.hidden = true;
        el.style.display = 'none';
        if (State.timerInterval) clearInterval(State.timerInterval);
        return;
      }

      const totalHours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(totalHours / 24);
      const hours = totalHours % 24; // NUNCA MOSTRA HORAS ACIMA DE 24
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      let timerText = '';
      if (days >= 1) {
        // Faltando mais de 1 dia: dias e horas ("3d 04h 12m")
        timerText = `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
      } else {
        // Menos de 24h: horas, minutos e segundos ("04h 12m 35s")
        timerText = `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
      }

      el.hidden = false;
      el.style.display = 'block';
      el.innerHTML = `
        <div class="urgency-inner">
          <span class="urgency-tag">🔥 ${sanitize(CONFIG.campanha.nome)}</span>
          <span>${sanitize(CONFIG.campanha.textoBeneficio)}</span>
          <span class="urgency-timer">⏱️ Termina em: <strong>${timerText}</strong></span>
          ${CONFIG.campanha.cupom ? `
            <button type="button" class="urgency-coupon-btn" id="btn-copy-urgency-coupon" title="Copiar cupom">
              Cupom: <strong>${sanitize(CONFIG.campanha.cupom)}</strong>
            </button>
          ` : ''}
        </div>
      `;

      document.getElementById('btn-copy-urgency-coupon')?.addEventListener('click', () => {
        showToast(`Cupom ${CONFIG.campanha.cupom} copiado!`);
      });
    };

    updateTimer();
    State.timerInterval = setInterval(updateTimer, 1000);
  }

  // ==========================================================================
  // 2. CABEÇALHO FIXO COM LOGO, LINK DO CARDÁPIO E CARRINHO (CONTADOR + TOTAL)
  // ==========================================================================
  function renderHeader() {
    const brandName = document.getElementById('header-brand-name');
    if (brandName) brandName.textContent = CONFIG.nomeCurto || CONFIG.nome;

    const brandStatus = document.getElementById('header-brand-status');
    const statusText = document.getElementById('header-status-text');
    const status = getStoreStatus();

    if (brandStatus && statusText) {
      brandStatus.className = `brand-status-tag ${status.isOpen ? 'status-open' : 'status-closed'}`;
      statusText.textContent = `${status.text} • ${status.detail}`;
    }

    document.getElementById('btn-header-cart')?.addEventListener('click', openCartDrawer);
    document.getElementById('btn-open-mobile-cart')?.addEventListener('click', openCartDrawer);
  }

  // ==========================================================================
  // 3. DOBRA PRINCIPAL (HERO) COM BENEFÍCIO, 2 BOTÕES, FOTO E NOTA GOOGLE
  // ==========================================================================
  function renderHero() {
    const taglineEl = document.getElementById('hero-badge-tagline');
    if (taglineEl) taglineEl.textContent = CONFIG.tagline;

    const descEl = document.getElementById('hero-desc');
    if (descEl) descEl.textContent = CONFIG.descricao;

    const btnZap = document.getElementById('btn-hero-whatsapp');
    if (btnZap) {
      btnZap.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent('Olá! Vim pelo cardápio e gostaria de tirar uma dúvida.')}`;
    }

    // Prova Social Google: REGRA NÃO NEGOCIÁVEL - NÃO INVENTE DADOS
    const ratingWrap = document.getElementById('hero-google-rating-wrap');
    if (ratingWrap) {
      if (CONFIG.notaGoogle && CONFIG.avaliacoesCount) {
        ratingWrap.innerHTML = `
          <div class="hero-google-rating">
            <span class="hero-google-stars">★★★★★</span>
            <span><strong>${Number(CONFIG.notaGoogle).toFixed(1)}</strong> no Google</span>
            <span>(${CONFIG.avaliacoesCount} avaliações reais)</span>
          </div>
        `;
      } else {
        // Se o cliente não forneceu a nota real, a seção é ocultada
        ratingWrap.innerHTML = '<!-- Prova social Google aguardando dados reais do cliente -->';
      }
    }
  }

  // ==========================================================================
  // 4. COMBOS EM DESTAQUE (3 A 4 CARDS COM PREÇO RISCADO E ITENS INCLUSOS)
  // ==========================================================================
  function renderCombos() {
    const grid = document.getElementById('combos-grid');
    if (!grid) return;

    const combos = CONFIG.combosDestaque || [];
    if (combos.length === 0) {
      document.getElementById('combos-section').style.display = 'none';
      return;
    }

    grid.innerHTML = combos.map(c => `
      <article class="combo-card">
        ${c.badge ? `<span class="combo-badge">${sanitize(c.badge)}</span>` : ''}
        <div class="combo-media">
          <picture>
            <source srcset="${sanitize(c.imagem)}" type="image/webp">
            <img src="${sanitize(c.imagem)}" alt="${sanitize(c.nome)}" width="600" height="400" loading="lazy">
          </picture>
        </div>
        <div class="combo-body">
          <h3 class="combo-title">${sanitize(c.nome)}</h3>
          <span class="combo-inclusos-title">O que vem incluso:</span>
          <ul class="combo-inclusos-list">
            ${c.itensInclusos.map(item => `<li>${sanitize(item)}</li>`).join('')}
          </ul>
          <div class="combo-footer">
            <div class="combo-price-box">
              ${c.precoAntigo ? `<span class="combo-price-old">${formatMoney(c.precoAntigo)}</span>` : ''}
              <span class="combo-price-current">${formatMoney(c.preco)}</span>
            </div>
            <button type="button" class="btn-add-fast" onclick="window.__addComboToCart('${c.id}')">
              <span>+</span> Adicionar
            </button>
          </div>
        </div>
      </article>
    `).join('');

    window.__addComboToCart = function (comboId) {
      const combo = combos.find(c => c.id === comboId);
      if (!combo) return;

      const existing = State.cart.find(i => i.id === comboId);
      if (existing) {
        existing.qty++;
      } else {
        State.cart.push({ id: comboId, nome: combo.nome, preco: combo.preco, qty: 1, obs: '' });
      }
      showToast(`Adicionado: ${combo.nome}`);
      updateCartUI();
    };
  }

  // ==========================================================================
  // 5. DIFERENCIAIS (4 ITENS CURTOS E CONCRETOS)
  // ==========================================================================
  function renderDiferenciais() {
    const grid = document.getElementById('diferenciais-grid');
    if (!grid) return;

    const diffs = CONFIG.diferenciais || [];
    grid.innerHTML = diffs.map(d => `
      <div class="diferencial-card">
        <span class="diferencial-icon" aria-hidden="true">${d.icone}</span>
        <h3 class="diferencial-title">${sanitize(d.titulo)}</h3>
        <p class="diferencial-desc">${sanitize(d.desc)}</p>
      </div>
    `).join('');
  }

  // ==========================================================================
  // 6. CARDÁPIO COMPLETO COM FILTRO POR CATEGORIA E BUSCA POR NOME
  // ==========================================================================
  function renderCardapioControls() {
    const catList = document.getElementById('category-filter-list');
    if (!catList) return;

    const cats = CONFIG.categorias || ['Todos'];
    catList.innerHTML = cats.map(cat => `
      <li role="presentation">
        <button 
          type="button" 
          role="tab" 
          class="category-filter-btn ${cat === State.selectedCategory ? 'active' : ''}" 
          data-category="${sanitize(cat)}"
          aria-selected="${cat === State.selectedCategory ? 'true' : 'false'}"
        >
          ${sanitize(cat)}
        </button>
      </li>
    `).join('');

    catList.querySelectorAll('.category-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        State.selectedCategory = e.currentTarget.getAttribute('data-category');
        catList.querySelectorAll('.category-filter-btn').forEach(b => {
          const active = b.getAttribute('data-category') === State.selectedCategory;
          b.classList.toggle('active', active);
          b.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        renderCardapioGrid();
      });
    });

    const searchInput = document.getElementById('search-cardapio-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        State.searchQuery = e.target.value.toLowerCase().trim();
        renderCardapioGrid();
      });
    }
  }

  function renderCardapioGrid() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    const allProducts = CONFIG.produtos || [];

    const filtered = allProducts.filter(p => {
      // Filtro de categoria
      const matchCat = State.selectedCategory === 'Todos' || p.categoria === State.selectedCategory;
      // Filtro de busca por nome ou descrição
      const matchSearch = !State.searchQuery || 
        p.nome.toLowerCase().includes(State.searchQuery) || 
        p.descricao.toLowerCase().includes(State.searchQuery);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
          <p style="font-size: 1.1rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.35rem;">Nenhum item encontrado</p>
          <p style="font-size: 0.9rem;">Tente buscar com outro termo ou selecione a categoria "Todos".</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(p => {
      const cartItem = State.cart.find(i => i.id === p.id);
      const qty = cartItem ? cartItem.qty : 0;

      return `
        <article class="product-card" id="card-${p.id}">
          ${p.badge ? `<span class="product-card-badge">${sanitize(p.badge)}</span>` : ''}
          <div class="product-card-media">
            <picture>
              <source srcset="${sanitize(p.imagem)}" type="image/webp">
              <img src="${sanitize(p.imagem)}" alt="${sanitize(p.nome)}" width="600" height="450" loading="lazy">
            </picture>
          </div>
          <div class="product-card-body">
            <h3 class="product-card-title">${sanitize(p.nome)}</h3>
            <p class="product-card-desc">${sanitize(p.descricao)}</p>
            <div class="product-card-footer">
              <div class="product-price-box">
                ${p.precoAntigo ? `<span class="product-price-old">${formatMoney(p.precoAntigo)}</span>` : ''}
                <span class="product-price-current">${formatMoney(p.preco)}</span>
              </div>
              <div class="product-action-box" id="action-box-${p.id}">
                ${qty === 0 ? `
                  <button type="button" class="btn-add-fast" onclick="window.__addProductToCart('${p.id}')">
                    <span>+</span> Adicionar
                  </button>
                ` : `
                  <div class="card-stepper">
                    <button type="button" class="card-stepper-btn" onclick="window.__changeQty('${p.id}', -1)" aria-label="Diminuir">−</button>
                    <span class="card-stepper-qty">${qty}</span>
                    <button type="button" class="card-stepper-btn" onclick="window.__changeQty('${p.id}', 1)" aria-label="Aumentar">+</button>
                  </div>
                `}
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    window.__addProductToCart = function (prodId) {
      const prod = CONFIG.produtos.find(p => p.id === prodId);
      if (!prod) return;

      const existing = State.cart.find(i => i.id === prodId);
      if (existing) {
        existing.qty++;
      } else {
        State.cart.push({ id: prodId, nome: prod.nome, preco: prod.preco, qty: 1, obs: '' });
      }
      showToast(`Adicionado: ${prod.nome}`);
      updateCartUI();
    };

    window.__changeQty = function (prodId, delta) {
      const idx = State.cart.findIndex(i => i.id === prodId);
      if (idx === -1) return;

      State.cart[idx].qty += delta;
      if (State.cart[idx].qty <= 0) {
        State.cart.splice(idx, 1);
      }
      updateCartUI();
    };
  }

  // ==========================================================================
  // 7. AVALIAÇÕES REAIS (RENDERIZA SÓ SE REVIEWS.LENGTH > 0)
  // ==========================================================================
  function renderAvaliacoes() {
    const el = document.getElementById('avaliacoes-section');
    if (!el) return;

    const reviews = CONFIG.avaliacoes || [];
    // REGRA: Se não houver depoimentos reais, a seção não renderiza
    if (reviews.length === 0) {
      el.style.display = 'none';
      return;
    }

    el.innerHTML = `
      <div class="container">
        <div class="section-title-wrap">
          <span class="section-badge">Clientes Satisfeitos</span>
          <h2 class="section-heading">O que diz quem já pediu</h2>
          <p class="section-sub">Avaliações reais de clientes do bairro que pedem toda semana</p>
        </div>
        <div class="reviews-grid">
          ${reviews.map(r => `
            <div class="review-card">
              <div class="review-card-top">
                <strong class="review-author">${sanitize(r.autor)}</strong>
                <span class="review-time">${sanitize(r.data)}</span>
              </div>
              <div class="review-stars-row" aria-label="${r.nota} estrelas">★★★★★</div>
              <p class="review-text">"${sanitize(r.texto)}"</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // 8. ENTREGA E RETIRADA: ENDEREÇO, HORÁRIO, TEMPO MÉDIO, RAIO
  // ==========================================================================
  function renderEntregaRetirada() {
    const grid = document.getElementById('info-cards-grid');
    if (!grid) return;

    grid.innerHTML = `
      <div class="info-card">
        <span class="info-card-icon" aria-hidden="true">📍</span>
        <span class="info-card-title">Localização</span>
        <strong class="info-card-value">${sanitize(CONFIG.endereco)}</strong>
        <p class="info-card-desc">${sanitize(CONFIG.bairro || '')} - ${sanitize(CONFIG.cidadeUF)}</p>
        <a href="${sanitize(CONFIG.googleMapsLink)}" target="_blank" rel="noopener noreferrer" style="font-size: 0.825rem; font-weight: 700; margin-top: 0.4rem;">
          Abrir no Google Maps ↗
        </a>
      </div>

      <div class="info-card">
        <span class="info-card-icon" aria-hidden="true">⏱️</span>
        <span class="info-card-title">Tempo Médio</span>
        <strong class="info-card-value">${sanitize(CONFIG.tempoMedioEntrega)}</strong>
        <p class="info-card-desc">Produção artesanal na chapa e entrega em embalagem térmica.</p>
      </div>

      <div class="info-card">
        <span class="info-card-icon" aria-hidden="true">🛵</span>
        <span class="info-card-title">Raio de Atendimento</span>
        <strong class="info-card-value">${sanitize(CONFIG.raioEntrega)}</strong>
        <p class="info-card-desc">Taxa fixa de ${formatMoney(CONFIG.taxaEntregaPadrao)}. Frete GRÁTIS acima de ${formatMoney(CONFIG.freteGratisAcima)}!</p>
      </div>

      <div class="info-card">
        <span class="info-card-icon" aria-hidden="true">🏪</span>
        <span class="info-card-title">Retirada no Balcão</span>
        <strong class="info-card-value">Taxa R$ 0,00</strong>
        <p class="info-card-desc">Prefere passar para buscar? Avisamos no WhatsApp assim que estiver pronto.</p>
      </div>
    `;
  }

  // ==========================================================================
  // 9. PERGUNTAS FREQUENTES EM ACCORDION
  // ==========================================================================
  function renderFAQ() {
    const list = document.getElementById('faq-list');
    if (!list) return;

    const faqs = CONFIG.faq || [];
    list.innerHTML = faqs.map((f, i) => `
      <details class="faq-item" ${i === 0 ? 'open' : ''}>
        <summary class="faq-summary">${sanitize(f.pergunta)}</summary>
        <div class="faq-content">
          <p>${sanitize(f.resposta)}</p>
        </div>
      </details>
    `).join('');
  }

  // ==========================================================================
  // 10. FECHAMENTO COM CHAMADA FINAL E BOTÃO GRANDE DE WHATSAPP
  // ==========================================================================
  function renderFechamento() {
    const btn = document.getElementById('btn-cta-final-whatsapp');
    if (btn) {
      btn.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent('Olá! Gostaria de fazer meu pedido direto pelo WhatsApp.')}`;
    }
  }

  // ==========================================================================
  // 11. RODAPÉ COM ENDEREÇO, HORÁRIO, TELEFONE E INSTAGRAM
  // ==========================================================================
  function renderFooter() {
    const el = document.getElementById('site-footer');
    if (!el) return;

    const days = Object.keys(CONFIG.horarios || {}).map(k => CONFIG.horarios[k]);

    el.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col">
            <h3>${sanitize(CONFIG.nome)}</h3>
            <p>${sanitize(CONFIG.descricao)}</p>
            <p><strong>Endereço:</strong> ${sanitize(CONFIG.endereco)}, ${sanitize(CONFIG.bairro || '')} - ${sanitize(CONFIG.cidadeUF)}</p>
            ${CONFIG.instagram ? `
              <p>
                <a href="${sanitize(CONFIG.instagramLink || '#')}" target="_blank" rel="noopener noreferrer">
                  📸 Instagram: <strong>${sanitize(CONFIG.instagram)}</strong>
                </a>
              </p>
            ` : ''}
          </div>

          <div class="footer-col">
            <h3>Horários de Atendimento</h3>
            <ul class="footer-hours-list">
              ${days.map(d => `
                <li>
                  <span>${sanitize(d.dia)}</span>
                  <strong>${sanitize(d.label)}</strong>
                </li>
              `).join('')}
            </ul>
          </div>

          <div class="footer-col">
            <h3>Atendimento Direto</h3>
            <p>Fale conosco no WhatsApp para dúvidas ou pedidos personalizados:</p>
            <p style="font-size: 1.15rem; font-weight: 800; color: var(--whatsapp); margin: 0.5rem 0;">
              ${sanitize(CONFIG.whatsappDisplay)}
            </p>
            <a href="https://wa.me/${CONFIG.whatsappNumber}" target="_blank" rel="noopener noreferrer" class="btn-hero-whatsapp" style="padding: 0.65rem 1.25rem; font-size: 0.9rem;">
              <span>💬</span> Falar no WhatsApp
            </a>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© ${new Date().getFullYear()} ${sanitize(CONFIG.nome)}. Todos os direitos reservados. Pedidos diretos sem intermediários.</p>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // 12. BOTÃO FLUTUANTE DE WHATSAPP E BARRA INFERIOR NO CELULAR
  // ==========================================================================
  function renderFloatingElements() {
    const floatBtn = document.getElementById('floating-whatsapp-btn');
    if (floatBtn) {
      floatBtn.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent('Olá! Vim pelo cardápio e gostaria de fazer um pedido.')}`;
    }
  }

  // ==========================================================================
  // CARRINHO E WHATSAPP: DRAWER LATERAL, VALIDAÇÃO E MENSAGEM PADRONIZADA
  // ==========================================================================
  function calculateTotals() {
    let subtotal = 0;
    let totalItems = 0;

    State.cart.forEach(item => {
      subtotal += item.preco * item.qty;
      totalItems += item.qty;
    });

    let shipping = 0;
    if (State.deliveryType === 'entrega') {
      shipping = subtotal >= CONFIG.freteGratisAcima ? 0 : CONFIG.taxaEntregaPadrao;
    }

    const total = subtotal + shipping;

    return {
      subtotal,
      shipping,
      total,
      totalItems,
      isMinOrderMet: subtotal >= CONFIG.pedidoMinimo
    };
  }

  function updateCartUI() {
    persistData();
    const totals = calculateTotals();

    // 1. Atualiza cabeçalho
    const headerBadge = document.getElementById('header-cart-badge');
    if (headerBadge) headerBadge.textContent = totals.totalItems;

    const headerTotal = document.getElementById('header-cart-total');
    if (headerTotal) headerTotal.textContent = formatMoney(totals.total);

    // 2. Atualiza barra inferior no celular
    const mobileQty = document.getElementById('mobile-bar-qty');
    if (mobileQty) mobileQty.textContent = `${totals.totalItems} ${totals.totalItems === 1 ? 'item' : 'itens'}`;

    const mobileTotal = document.getElementById('mobile-bar-total');
    if (mobileTotal) mobileTotal.textContent = formatMoney(totals.total);

    // 3. Atualiza steppers do cardápio visível
    renderCardapioGrid();

    // 4. Se o drawer estiver aberto, re-renderiza seu conteúdo
    if (State.isCartOpen) {
      renderCartDrawerContent();
    }
  }

  function openCartDrawer() {
    State.isCartOpen = true;
    const root = document.getElementById('cart-drawer-root');
    if (!root) return;

    root.innerHTML = `
      <div class="cart-drawer-backdrop" id="cart-backdrop"></div>
      <aside class="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title">
        <div class="cart-drawer-header">
          <h2 class="cart-drawer-title" id="cart-drawer-title">🛒 Seu Pedido</h2>
          <button type="button" class="cart-close-btn" id="btn-close-cart" aria-label="Fechar sacola">✕</button>
        </div>
        <div id="cart-drawer-inner-content"></div>
      </aside>
    `;

    document.getElementById('btn-close-cart')?.addEventListener('click', closeCartDrawer);
    document.getElementById('cart-backdrop')?.addEventListener('click', closeCartDrawer);

    renderCartDrawerContent();
  }

  function closeCartDrawer() {
    State.isCartOpen = false;
    const root = document.getElementById('cart-drawer-root');
    if (root) root.innerHTML = '';
  }

  function renderCartDrawerContent() {
    const container = document.getElementById('cart-drawer-inner-content');
    if (!container) return;

    const totals = calculateTotals();

    if (State.cart.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 1rem;">
          <span style="font-size: 3rem;">🛒</span>
          <p style="font-size: 1.1rem; font-weight: 700; color: var(--text-main);">Sua sacola está vazia</p>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Adicione seus smash burgers e acompanhamentos favoritos para fechar no WhatsApp em menos de 1 minuto!</p>
          <button type="button" class="btn-hero-primary" onclick="document.getElementById('btn-close-cart').click()" style="margin-top: 0.5rem; padding: 0.65rem 1.25rem;">
            Ver Cardápio
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="cart-drawer-body">
        <!-- Alternador Entrega / Retirada -->
        <div class="delivery-toggle-group" role="radiogroup" aria-label="Modalidade">
          <button type="button" class="toggle-option-btn ${State.deliveryType === 'entrega' ? 'active' : ''}" id="toggle-opt-entrega">
            🛵 Entrega Delivery
          </button>
          <button type="button" class="toggle-option-btn ${State.deliveryType === 'retirada' ? 'active' : ''}" id="toggle-opt-retirada">
            🏪 Retirada no Balcão
          </button>
        </div>

        <!-- Lista de Itens -->
        <ul class="cart-items-list" aria-label="Itens do pedido">
          ${State.cart.map(item => `
            <li class="cart-item-row">
              <div class="cart-item-top">
                <span class="cart-item-title">${sanitize(item.nome)}</span>
                <span class="cart-item-price">${formatMoney(item.preco * item.qty)}</span>
              </div>
              <div class="cart-item-bottom">
                <div class="card-stepper">
                  <button type="button" class="card-stepper-btn" onclick="window.__changeQty('${item.id}', -1)">−</button>
                  <span class="card-stepper-qty">${item.qty}</span>
                  <button type="button" class="card-stepper-btn" onclick="window.__changeQty('${item.id}', 1)">+</button>
                </div>
                <button type="button" style="color: var(--danger); font-size: 0.8rem; font-weight: 700;" onclick="window.__removeItemFromCart('${item.id}')">
                  Remover
                </button>
              </div>
            </li>
          `).join('')}
        </ul>

        <!-- Dados do Cliente e Endereço -->
        <div class="checkout-form-section">
          <span class="form-section-title">👤 Identificação</span>
          <div class="form-field">
            <label for="cart-input-nome">Seu Nome *</label>
            <input type="text" id="cart-input-nome" placeholder="Como podemos te chamar?" value="${sanitize(State.customer.nome)}">
          </div>

          ${State.deliveryType === 'entrega' ? `
            <div class="form-row">
              <div class="form-field" style="grid-column: span 2;">
                <label for="cart-input-rua">Rua e Bairro *</label>
                <input type="text" id="cart-input-rua" placeholder="Ex: Rua Harmonia, Vila Madalena" value="${sanitize(State.customer.rua)}">
              </div>
            </div>
            <div class="form-row">
              <div class="form-field">
                <label for="cart-input-num">Número *</label>
                <input type="text" id="cart-input-num" placeholder="Ex: 382" value="${sanitize(State.customer.numero)}">
              </div>
              <div class="form-field">
                <label for="cart-input-comp">Complemento / Apto</label>
                <input type="text" id="cart-input-comp" placeholder="Ex: Apto 42" value="${sanitize(State.customer.complemento)}">
              </div>
            </div>
          ` : `
            <div style="background-color: var(--bg-surface); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px dashed var(--border-subtle); font-size: 0.825rem;">
              <strong style="color: var(--primary);">Retirada no balcão:</strong><br>
              ${sanitize(CONFIG.endereco)} - ${sanitize(CONFIG.bairro || '')} (${sanitize(CONFIG.cidadeUF)})
            </div>
          `}
        </div>

        <!-- Forma de Pagamento -->
        <div class="checkout-form-section">
          <span class="form-section-title">💳 Forma de Pagamento</span>
          <div class="payment-methods-grid">
            <button type="button" class="payment-method-card ${State.customer.pagamento === 'pix' ? 'active' : ''}" data-pay="pix">
              <span>⚡</span> <span>Pix</span>
            </button>
            <button type="button" class="payment-method-card ${State.customer.pagamento === 'cartao' ? 'active' : ''}" data-pay="cartao">
              <span>💳</span> <span>Cartão</span>
            </button>
            <button type="button" class="payment-method-card ${State.customer.pagamento === 'dinheiro' ? 'active' : ''}" data-pay="dinheiro">
              <span>💵</span> <span>Dinheiro</span>
            </button>
          </div>

          ${State.customer.pagamento === 'dinheiro' ? `
            <div class="form-field" style="margin-top: 0.5rem;">
              <label for="cart-input-troco">Precisa de troco para quanto?</label>
              <input type="text" id="cart-input-troco" placeholder="Ex: R$ 50 ou Não preciso" value="${sanitize(State.customer.trocoPara)}">
            </div>
          ` : ''}
        </div>

        <!-- Observação Geral -->
        <div class="checkout-form-section">
          <span class="form-section-title">📝 Observação do Pedido</span>
          <div class="form-field">
            <textarea id="cart-input-obs" rows="2" placeholder="Ex: sem cebola, ponto da carne bem passado, maionese à parte">${sanitize(State.customer.observacaoGeral)}</textarea>
          </div>
        </div>
      </div>

      <!-- Resumo Financeiro & Enviar WhatsApp -->
      <div class="cart-drawer-footer">
        <div class="cart-summary-lines">
          <div class="cart-summary-line">
            <span>Subtotal:</span>
            <span>${formatMoney(totals.subtotal)}</span>
          </div>
          <div class="cart-summary-line">
            <span>Taxa de entrega:</span>
            <span>${totals.shipping === 0 
              ? (State.deliveryType === 'retirada' ? 'R$ 0,00 (Retirada)' : 'GRÁTIS') 
              : formatMoney(totals.shipping)}</span>
          </div>
          <div class="cart-summary-line total-line">
            <span>TOTAL:</span>
            <span>${formatMoney(totals.total)}</span>
          </div>
        </div>

        ${!totals.isMinOrderMet ? `
          <div style="background-color: rgba(244, 63, 94, 0.15); border: 1px solid var(--danger); color: #fca5a5; padding: 0.5rem; border-radius: 6px; font-size: 0.775rem; text-align: center; font-weight: 700;">
            ⚠️ Pedido mínimo de ${formatMoney(CONFIG.pedidoMinimo)}.
          </div>
        ` : ''}

        <button type="button" class="btn-submit-whatsapp" id="btn-submit-order-whatsapp" ${!totals.isMinOrderMet ? 'disabled' : ''}>
          <span>🚀 Enviar Pedido no WhatsApp</span>
        </button>
      </div>
    `;

    setupCartEvents();
  }

  function setupCartEvents() {
    document.getElementById('toggle-opt-entrega')?.addEventListener('click', () => {
      State.deliveryType = 'entrega';
      updateCartUI();
    });

    document.getElementById('toggle-opt-retirada')?.addEventListener('click', () => {
      State.deliveryType = 'retirada';
      updateCartUI();
    });

    window.__removeItemFromCart = function (id) {
      const idx = State.cart.findIndex(i => i.id === id);
      if (idx !== -1) {
        State.cart.splice(idx, 1);
        updateCartUI();
      }
    };

    const bind = (id, key) => {
      document.getElementById(id)?.addEventListener('input', (e) => {
        State.customer[key] = e.target.value;
        persistData();
      });
    };

    bind('cart-input-nome', 'nome');
    bind('cart-input-rua', 'rua');
    bind('cart-input-num', 'numero');
    bind('cart-input-comp', 'complemento');
    bind('cart-input-troco', 'trocoPara');
    bind('cart-input-obs', 'observacaoGeral');

    document.querySelectorAll('.payment-method-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        State.customer.pagamento = e.currentTarget.getAttribute('data-pay');
        updateCartUI();
      });
    });

    document.getElementById('btn-submit-order-whatsapp')?.addEventListener('click', sendOrderToWhatsApp);
  }

  // ==========================================================================
  // FORMATO EXATO DA MENSAGEM DO WHATSAPP (LEGÍVEL NO CELULAR DO DONO)
  // ==========================================================================
  function sendOrderToWhatsApp() {
    const totals = calculateTotals();

    // Validações
    if (State.cart.length === 0) {
      showToast('Sua sacola está vazia.');
      return;
    }

    if (!totals.isMinOrderMet) {
      showToast(`Pedido mínimo de ${formatMoney(CONFIG.pedidoMinimo)}.`);
      return;
    }

    const nome = (State.customer.nome || '').trim();
    if (!nome) {
      showToast('Por favor, informe seu Nome.');
      document.getElementById('cart-input-nome')?.focus();
      return;
    }

    if (State.deliveryType === 'entrega') {
      const rua = (State.customer.rua || '').trim();
      const num = (State.customer.numero || '').trim();
      if (!rua || !num) {
        showToast('Por favor, informe Rua e Número para a entrega.');
        document.getElementById('cart-input-rua')?.focus();
        return;
      }
    }

    persistData();

    // Monta a mensagem no padrão exato solicitado
    let msg = `*Novo pedido — ${CONFIG.nome}*\n`;
    msg += `Cliente: ${nome}\n`;

    if (State.deliveryType === 'entrega') {
      let enderecoFormatado = `Rua ${State.customer.rua.trim()}, ${State.customer.numero.trim()}`;
      if (State.customer.complemento && State.customer.complemento.trim()) {
        enderecoFormatado += ` — ${State.customer.complemento.trim()}`;
      }
      if (State.customer.bairro && State.customer.bairro.trim()) {
        enderecoFormatado += ` (${State.customer.bairro.trim()})`;
      }
      msg += `Entrega em: ${enderecoFormatado}\n`;
    } else {
      msg += `Retirada no balcão: ${CONFIG.endereco} (${CONFIG.bairro || CONFIG.cidadeUF})\n`;
    }

    // Pagamento
    let pagLabel = 'Pix';
    if (State.customer.pagamento === 'cartao') {
      pagLabel = 'Cartão na entrega';
    } else if (State.customer.pagamento === 'dinheiro') {
      pagLabel = 'Dinheiro';
      if (State.customer.trocoPara && State.customer.trocoPara.trim()) {
        pagLabel += ` (Troco para ${State.customer.trocoPara.trim()})`;
      }
    }
    msg += `Pagamento: ${pagLabel}\n`;

    // Itens
    msg += `Itens:\n`;
    State.cart.forEach(item => {
      msg += `${item.qty}x ${item.nome} — ${formatMoney(item.preco * item.qty)}\n`;
    });

    // Totais
    msg += `Subtotal: ${formatMoney(totals.subtotal)}\n`;
    if (State.deliveryType === 'entrega') {
      msg += `Taxa de entrega: ${totals.shipping === 0 ? 'GRÁTIS' : formatMoney(totals.shipping)}\n`;
    } else {
      msg += `Taxa de entrega: R$ 0,00 (Retirada)\n`;
    }
    msg += `*Total: ${formatMoney(totals.total)}*\n`;

    // Observação
    if (State.customer.observacaoGeral && State.customer.observacaoGeral.trim()) {
      msg += `Obs: ${State.customer.observacaoGeral.trim()}\n`;
    }

    // URL oficial wa.me com encodeURIComponent seguro contra quebra de acentos e emojis
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;

    showToast('Abrindo WhatsApp...');
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // ==========================================================================
  // INICIALIZAÇÃO
  // ==========================================================================
  function init() {
    loadPersistedData();
    initUrgencyBar();
    renderHeader();
    renderHero();
    renderCombos();
    renderDiferenciais();
    renderCardapioControls();
    renderCardapioGrid();
    renderAvaliacoes();
    renderEntregaRetirada();
    renderFAQ();
    renderFechamento();
    renderFooter();
    renderFloatingElements();
    updateCartUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
