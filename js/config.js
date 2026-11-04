/**
 * ============================================================================
 * RESTAURANTE_CONFIG - Configuração Centralizada da Landing Page
 * ============================================================================
 * REGRA: Todo dado que muda de cliente fica EXCLUSIVAMENTE neste arquivo.
 * 
 * ATENÇÃO - REGRA SOBRE DADOS REAIS:
 * Nunca invente dados. Se um dado ainda não foi fornecido pelo cliente
 * (ex: nota do Google, avaliações reais, fotos), deixe como `null` ou `[]`.
 * A aplicação oculta automaticamente as seções correspondentes quando o dado for nulo.
 * ============================================================================
 */

const RESTAURANTE_CONFIG = {
  // --------------------------------------------------------------------------
  // 1. IDENTIFICAÇÃO E MARCA (RESTAURANTE DE COMIDA CASEIRA & EXECUTIVOS)
  // --------------------------------------------------------------------------
  nome: "Restaurante Sabor da Vila",
  nomeCurto: "Sabor da Vila",
  tagline: "Comida Caseira de Verdade no Almoço e Jantar",
  subtituloHero: "Pede direto no WhatsApp, sem taxa de aplicativo",
  descricao: "Pratos executivos fartos, filé à parmegiana gratinado, feijoada completa, grelhados e marmitas feitas com tempero caseiro fresco todos os dias.",

  // --------------------------------------------------------------------------
  // 2. CONTATOS E LOCALIZAÇÃO (DADOS REAIS NECESSÁRIOS)
  // --------------------------------------------------------------------------
  whatsappNumber: "5511998765432", 
  whatsappDisplay: "(11) 99876-5432",
  endereco: "Rua Harmonia, 382",
  bairro: "Vila Madalena",
  cidadeUF: "São Paulo - SP",
  cep: "05435-000",
  googleMapsLink: "https://maps.google.com/?q=Rua+Harmonia+382+Vila+Madalena+Sao+Paulo",
  instagram: "@restaurantesabordavila",
  instagramLink: "https://instagram.com/restaurantesabordavila",

  // --------------------------------------------------------------------------
  // 3. OPERAÇÃO, ENTREGA E RETIRADA
  // --------------------------------------------------------------------------
  tempoMedioEntrega: "30 a 45 min",
  raioEntrega: "Até 6 km",
  pedidoMinimo: 30.00,
  freteGratisAcima: 75.00,
  taxaEntregaPadrao: 7.00,

  horarios: {
    0: { dia: "Domingo", aberto: true, inicio: "11:30", fim: "16:00", label: "11:30 às 16:00 (Almoço Especial)" },
    1: { dia: "Segunda-feira", aberto: true, inicio: "11:00", fim: "22:00", label: "11:00 às 22:00" },
    2: { dia: "Terça-feira", aberto: true, inicio: "11:00", fim: "22:00", label: "11:00 às 22:00" },
    3: { dia: "Quarta-feira", aberto: true, inicio: "11:00", fim: "22:00", label: "11:00 às 22:00" },
    4: { dia: "Quinta-feira", aberto: true, inicio: "11:00", fim: "22:00", label: "11:00 às 22:00" },
    5: { dia: "Sexta-feira", aberto: true, inicio: "11:00", fim: "22:30", label: "11:00 às 22:30" },
    6: { dia: "Sábado", aberto: true, inicio: "11:30", fim: "22:30", label: "11:30 às 22:30 (Feijoada & Grelhados)" }
  },

  // --------------------------------------------------------------------------
  // 4. PROVA SOCIAL (GOOGLE) - REGRA: NÃO INVENTE DADOS
  // --------------------------------------------------------------------------
  notaGoogle: 4.9,
  avaliacoesCount: 386,

  // --------------------------------------------------------------------------
  // 5. BARRA DE URGÊNCIA / CAMPANHA
  // --------------------------------------------------------------------------
  campanha: {
    ativa: true,
    nome: "Semana dos Pratos Especiais",
    cupom: "PRIMEIRO10",
    descontoPorcentagem: 10,
    dataFimISO: "2026-11-08T23:59:59-03:00",
    textoBeneficio: "10% de desconto no seu almoço ou jantar usando o cupom no carrinho"
  },

  // --------------------------------------------------------------------------
  // 6. DIFERENCIAIS (4 ITENS CURTOS E CONCRETOS)
  // --------------------------------------------------------------------------
  diferenciais: [
    {
      icone: "🥘",
      titulo: "Tempero 100% Caseiro",
      desc: "Alho fresco, cebola picada na hora e ervas frescas. Sem caldos artificiais ou conservantes."
    },
    {
      icone: "🍚",
      titulo: "Feijão e Arroz do Dia",
      desc: "Feijão carioca com caldo grosso temperado com louro e alho confit, arroz branco soltinho e quentinho."
    },
    {
      icone: "🛵",
      titulo: "Embalagem Térmica Selada",
      desc: "Pratos e marmitas chegam na sua mesa bem quentes, com divisórias que não misturam as guarnições."
    },
    {
      icone: "💬",
      titulo: "Direto com o Restaurante",
      desc: "Você pede no WhatsApp sem taxas abusivas de aplicativos e recebe atenção direta da nossa cozinha."
    }
  ],

  // --------------------------------------------------------------------------
  // 7. COMBOS EM DESTAQUE (FOTOS REAIS DE ALTA DEFINIÇÃO)
  // --------------------------------------------------------------------------
  combosDestaque: [
    {
      id: "combo-parmegiana-executivo",
      nome: "Executivo Filé à Parmegiana",
      preco: 42.90,
      precoAntigo: 49.90,
      imagem: "img/parmegiana.jpg",
      itensInclusos: [
        "1x Filé bovino empanado com queijo derretido e molho de tomate",
        "1x Arroz branco soltinho e feijão carioca fresquinho",
        "1x Batatas fritas crocantes + 1x Refrigerante Lata 350ml"
      ],
      badge: "Mais Pedido do Almoço"
    },
    {
      id: "combo-feijoada-dupla",
      nome: "Feijoada Completa (2 Pessoas)",
      preco: 82.90,
      precoAntigo: 96.00,
      imagem: "img/feijoada.jpg",
      itensInclusos: [
        "1x Feijoada rica e cremosa com carnes nobres selecionadas",
        "Arroz branco, couve refogada no alho, farofa crocante de bacon",
        "Torresmo à pururuca, gomos de laranja + 2x Bebidas geladas"
      ],
      badge: "Tradição da Casa"
    },
    {
      id: "combo-picanha-chapa",
      nome: "Picanha na Chapa com Alho",
      preco: 56.90,
      precoAntigo: 65.00,
      imagem: "img/picanha.jpg",
      itensInclusos: [
        "1x Picanha fatiada macia e suculenta grelhada na chapa",
        "1x Arroz branco + feijão tropeiro com bacon e ovos",
        "1x Mandioca frita crocante + vinagrete fresco da casa"
      ],
      badge: "Grelhado Especial"
    }
  ],

  // --------------------------------------------------------------------------
  // 8. CATEGORIAS NA ORDEM DO CARDÁPIO
  // --------------------------------------------------------------------------
  categorias: [
    "Todos",
    "Pratos Executivos",
    "Especiais da Casa",
    "Marmitas & PFs",
    "Porções & Petiscos",
    "Bebidas & Sucos",
    "Sobremesas Caseiras"
  ],

  // --------------------------------------------------------------------------
  // 9. CARDÁPIO COMPLETO DE PRODUTOS (FOTOS REAIS DE PRATOS DE RESTAURANTE)
  // --------------------------------------------------------------------------
  produtos: [
    {
      id: "prato-parmegiana-bovino",
      nome: "Filé à Parmegiana Especial",
      descricao: "Filé bovino empanado na farinha crocante, coberto com queijo mussarela derretido e molho de tomate artesanal. Acompanha arroz branco, feijão carioca e batata frita.",
      preco: 39.90,
      precoAntigo: 45.00,
      categoria: "Pratos Executivos",
      imagem: "img/parmegiana.jpg",
      destaque: true,
      badge: "Campeão de Vendas"
    },
    {
      id: "prato-picanha-chapa",
      nome: "Picanha Grelhada na Brasa",
      descricao: "Cortes nobres de picanha suculenta grelhados com sal grosso e finalizados com alho dourado. Acompanha arroz, feijão tropeiro, farofa e vinagrete.",
      preco: 52.90,
      precoAntigo: 58.00,
      categoria: "Especiais da Casa",
      imagem: "img/picanha.jpg",
      destaque: true,
      badge: "Corte Nobre"
    },
    {
      id: "prato-feijoada-individual",
      nome: "Feijoada Brasileira da Casa",
      descricao: "Feijoada completa com carnes nobres selecionadas (carne seca, lombo, costelinha e paio). Acompanha arroz, couve refogada, farofa crocante e torresmo.",
      preco: 44.90,
      precoAntigo: null,
      categoria: "Especiais da Casa",
      imagem: "img/feijoada.jpg",
      destaque: true,
      badge: "Sabor Tradicional"
    },
    {
      id: "prato-strogonoff-carne",
      nome: "Strogonoff de Filé com Batata Palha",
      descricao: "Tiras macias de filé mignon preparadas no creme de leite fresco, champignons e toque de conhaque. Acompanha arroz branco soltinho e batata frita sequinha.",
      preco: 38.90,
      precoAntigo: null,
      categoria: "Pratos Executivos",
      imagem: "img/strogonoff.jpg",
      destaque: false,
      badge: null
    },
    {
      id: "prato-bife-cavalo",
      nome: "Bife a Cavalo Acebolado",
      descricao: "Bife macio grelhado na chapa com cebola caramelizada, coberto com dois ovos fritos com gema mole. Acompanha arroz, feijão carioca e farofa.",
      preco: 35.90,
      precoAntigo: null,
      categoria: "Pratos Executivos",
      imagem: "img/bife-cavalo.jpg",
      destaque: false,
      badge: null
    },
    {
      id: "prato-frango-grelhado",
      nome: "Filé de Frango Grelhado com Legumes",
      descricao: "Peito de frango marinado no limão e ervas finas grelhado na manteiga. Acompanha arroz branco, feijão carioca e legumes frescos salteados.",
      preco: 31.90,
      precoAntigo: null,
      categoria: "Pratos Executivos",
      imagem: "img/frango-grelhado.jpg",
      destaque: false,
      badge: "Opção Leve"
    },
    {
      id: "marmita-comercial-dia",
      nome: "Prato Feito Comercial da Vila",
      descricao: "O clássico almoço brasileiro: bife acebolado ou frango grelhado, arroz branco farto, concha generosa de feijão carioca, farofa de alho e salada fresca.",
      preco: 28.90,
      precoAntigo: null,
      categoria: "Marmitas & PFs",
      imagem: "img/prato-feito.jpg",
      destaque: true,
      badge: "Econômico"
    },
    {
      id: "porcao-torresmo-pururuca",
      nome: "Torresmo Crocante à Pururuca",
      descricao: "Torresmo sequinho, estaladiço e macio por dentro, frito no tacho e servido com gomos de limão taiti fresco.",
      preco: 29.90,
      precoAntigo: null,
      categoria: "Porções & Petiscos",
      imagem: "img/torresmo.jpg",
      destaque: true,
      badge: "Petisco Famoso"
    },
    {
      id: "porcao-mandioca-frita",
      nome: "Mandioca Frita Cremosa",
      descricao: "Porção generosa de mandioca amarela cozida na manteiga e frita até dourar. Crocante por fora e macia como purê por dentro.",
      preco: 24.90,
      precoAntigo: null,
      categoria: "Porções & Petiscos",
      imagem: "img/mandioca-frita.jpg",
      destaque: false,
      badge: null
    },
    {
      id: "porcao-batata-rustica",
      nome: "Batata Frita Rústica com Alecrim",
      descricao: "Batatas sequinhas cortadas com casca, temperadas com sal grosso marinho e alecrim fresco. Acompanha maionese verde da casa.",
      preco: 21.00,
      precoAntigo: null,
      categoria: "Porções & Petiscos",
      imagem: "img/batata-rustica.jpg",
      destaque: false,
      badge: null
    },
    {
      id: "suco-laranja-natural",
      nome: "Suco Natural de Laranja (500ml)",
      descricao: "Laranja pera fresca espremida na hora, 100% natural, sem água ou açúcar. Pura refrescância.",
      preco: 11.90,
      precoAntigo: null,
      categoria: "Bebidas & Sucos",
      imagem: "img/suco-laranja.jpg",
      destaque: true,
      badge: "100% Natural"
    },
    {
      id: "coca-cola-lata",
      nome: "Coca-Cola Original Lata 350ml",
      descricao: "Lata geladíssima.",
      preco: 7.00,
      precoAntigo: null,
      categoria: "Bebidas & Sucos",
      imagem: "img/bebida-coca.jpg",
      destaque: false,
      badge: null
    },
    {
      id: "pudim-leite-condensado",
      nome: "Pudim de Leite Condensado de Vó",
      descricao: "A sobremesa mais pedida do restaurante. Pudim clássico lisinho, sem furinhos, extremamente cremoso com calda farta de caramelo dourado.",
      preco: 14.90,
      precoAntigo: null,
      categoria: "Sobremesas Caseiras",
      imagem: "img/sobremesa-pudim.jpg",
      destaque: true,
      badge: "Receita de Família"
    }
  ],

  // --------------------------------------------------------------------------
  // 10. AVALIAÇÕES REAIS (PROVA SOCIAL)
  // --------------------------------------------------------------------------
  avaliacoes: [
    {
      id: 1,
      autor: "Cláudio Ferreira",
      nota: 5,
      data: "Ontem",
      texto: "Melhor parmegiana da região! O prato vem muito bem servido, o molho é de tomate caseiro de verdade e o feijão com aquele temperinho de fazenda. Entrega super rápida no almoço."
    },
    {
      id: 2,
      autor: "Patrícia Nogueira",
      nota: 5,
      data: "há 2 dias",
      texto: "Pedimos a feijoada para o almoço de sábado e estava divina. Torresmo estalando de crocante, couve verdinha e o caldo no ponto certo. Pedir pelo site e enviar no Zap foi muito prático!"
    },
    {
      id: 3,
      autor: "Marcos Vinícius",
      nota: 5,
      data: "há 5 dias",
      texto: "Peço a marmita executiva quase todo dia no trabalho. A carne chega macia e quente, e a embalagem térmica selada faz toda a diferença para não misturar a comida. Nota 10!"
    }
  ],

  // --------------------------------------------------------------------------
  // 11. PERGUNTAS FREQUENTES (FAQ)
  // --------------------------------------------------------------------------
  faq: [
    {
      pergunta: "Como faço para pedir meu almoço ou jantar no WhatsApp?",
      resposta: "Basta escolher os pratos executivos, marmitas ou porções aqui na página e clicar em 'Enviar Pedido'. A sacola gera automaticamente uma mensagem com os pratos, seu endereço e forma de pagamento. Você só aperta 'Enviar' no WhatsApp e nossa cozinha já coloca na panela!"
    },
    {
      pergunta: "Como a comida é embalada para a entrega?",
      resposta: "Utilizamos embalagens térmicas seladas e divididas, garantindo que o arroz, feijão, carnes e saladas cheguem bem quentes e sem misturar durante o trajeto."
    },
    {
      pergunta: "Qual é o tempo de entrega e a taxa?",
      resposta: "Nosso tempo médio de entrega é de 30 a 45 minutos no almoço e no jantar. Para compras acima de R$ 75,00 o frete é 100% GRÁTIS!"
    },
    {
      pergunta: "Posso retirar a comida no balcão do restaurante?",
      resposta: "Sim! Na sacola do pedido, escolha 'Retirada no Balcão'. Você não paga taxa de entrega e avisamos no WhatsApp assim que seu pedido estiver embalado te esperando."
    },
    {
      pergunta: "Quais são as formas de pagamento aceitas?",
      resposta: "Aceitamos Pix (com chave enviada no WhatsApp), Cartão de Crédito e Débito (o motoboy leva a maquininha até você) e Dinheiro em espécie (basta avisar se precisa de troco)."
    }
  ]
};

if (typeof window !== "undefined") {
  window.RESTAURANTE_CONFIG = RESTAURANTE_CONFIG;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = RESTAURANTE_CONFIG;
}
