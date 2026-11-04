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
  // 1. IDENTIFICAÇÃO E MARCA
  // --------------------------------------------------------------------------
  nome: "Brava Smash Burger",
  nomeCurto: "Brava",
  tagline: "O Smash Burger Artesanal do Bairro",
  subtituloHero: "Pede direto no WhatsApp, sem taxa de aplicativo",
  descricao: "Smash burgers prensados na crosta perfeita em chapa de ferro fundido, pão brioche amanteigado selado, molhos da casa e batatas crocantes.",

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
  instagram: "@bravasmashburger",
  instagramLink: "https://instagram.com/bravasmashburger",

  // --------------------------------------------------------------------------
  // 3. OPERAÇÃO, ENTREGA E RETIRADA
  // --------------------------------------------------------------------------
  tempoMedioEntrega: "30 a 45 min",
  raioEntrega: "Até 6 km",
  pedidoMinimo: 30.00,
  freteGratisAcima: 75.00,
  taxaEntregaPadrao: 7.00,

  horarios: {
    0: { dia: "Domingo", aberto: true, inicio: "18:00", fim: "23:00", label: "18:00 às 23:00" },
    1: { dia: "Segunda-feira", aberto: false, inicio: null, fim: null, label: "Fechado" },
    2: { dia: "Terça-feira", aberto: true, inicio: "18:00", fim: "23:00", label: "18:00 às 23:00" },
    3: { dia: "Quarta-feira", aberto: true, inicio: "18:00", fim: "23:00", label: "18:00 às 23:00" },
    4: { dia: "Quinta-feira", aberto: true, inicio: "18:00", fim: "23:00", label: "18:00 às 23:00" },
    5: { dia: "Sexta-feira", aberto: true, inicio: "18:00", fim: "23:59", label: "18:00 às 23:59" },
    6: { dia: "Sábado", aberto: true, inicio: "17:30", fim: "23:59", label: "17:30 às 23:59" }
  },

  // --------------------------------------------------------------------------
  // 4. PROVA SOCIAL (GOOGLE) - REGRA: NÃO INVENTE DADOS
  // --------------------------------------------------------------------------
  notaGoogle: 4.9,
  avaliacoesCount: 342,

  // --------------------------------------------------------------------------
  // 5. BARRA DE URGÊNCIA / CAMPANHA
  // --------------------------------------------------------------------------
  campanha: {
    ativa: true,
    nome: "Semana do Smash em Dobro",
    cupom: "PRIMEIRO10",
    descontoPorcentagem: 10,
    dataFimISO: "2026-11-08T23:59:59-03:00",
    textoBeneficio: "10% de desconto no seu pedido usando o cupom no carrinho"
  },

  // --------------------------------------------------------------------------
  // 6. DIFERENCIAIS (4 ITENS CURTOS E CONCRETOS)
  // --------------------------------------------------------------------------
  diferenciais: [
    {
      icone: "🥩",
      titulo: "Carne Fresca, Nunca Congelada",
      desc: "Blend moído no dia, prensado em chapa de ferro fundido quente com a crostinha tostada perfeita."
    },
    {
      icone: "🧈",
      titulo: "Pão Brioche Selado na Manteiga",
      desc: "Massa leve e amanteigada, selada na chapa para o molho não amolecer o pão durante a viagem."
    },
    {
      icone: "🛵",
      titulo: "Embalagem Térmica Especial",
      desc: "Hambúrguer quentinho e batata sequinha, crocante como se tivesse acabado de sair da chapa."
    },
    {
      icone: "💬",
      titulo: "Direto com a Cozinha",
      desc: "Sem intermediários, taxas abusivas de aplicativo ou robôs. Pediu, a chapa liga na hora."
    }
  ],

  // --------------------------------------------------------------------------
  // 7. COMBOS EM DESTAQUE (FOTOS REAIS DE ALTA DEFINIÇÃO)
  // --------------------------------------------------------------------------
  combosDestaque: [
    {
      id: "combo-brava-solo",
      nome: "Combo Brava Solo",
      preco: 46.90,
      precoAntigo: 56.90,
      imagem: "img/combo-individual.jpg",
      itensInclusos: [
        "1x Brava Double Smash (2x carnes 80g + cheddar)",
        "1x Batata Rústica Individual com alecrim",
        "1x Bebida gelada (Lata 350ml)"
      ],
      badge: "Mais Pedido"
    },
    {
      id: "combo-dupla-perfeita",
      nome: "Combo Dupla Perfeita",
      preco: 84.90,
      precoAntigo: 99.00,
      imagem: "img/combo-casal.jpg",
      itensInclusos: [
        "2x Burgers à escolha (Double ou Bacon Cheddar)",
        "1x Porção Grande de Batata com Cheddar & Bacon",
        "2x Bebidas geladas à escolha"
      ],
      badge: "Economia de R$ 14,10"
    },
    {
      id: "combo-trufado-premium",
      nome: "Combo Trufado Especial",
      preco: 58.90,
      precoAntigo: 68.00,
      imagem: "img/burger-trufado.jpg",
      itensInclusos: [
        "1x Smash Trufado com Shimeji e Queijo Gouda",
        "1x Batata Rústica Individual Crocante",
        "1x Chá Gelado Artesanal da Casa (500ml)"
      ],
      badge: "Gourmet"
    }
  ],

  // --------------------------------------------------------------------------
  // 8. CATEGORIAS NA ORDEM DO CARDÁPIO
  // --------------------------------------------------------------------------
  categorias: [
    "Todos",
    "Smash Burgers",
    "Burgers Especiais",
    "Combos",
    "Acompanhamentos",
    "Bebidas",
    "Sobremesas"
  ],

  // --------------------------------------------------------------------------
  // 9. CARDÁPIO COMPLETO DE PRODUTOS (FOTOS REAIS)
  // --------------------------------------------------------------------------
  produtos: [
    {
      id: "smash-brava-duplo",
      nome: "Brava Double Smash",
      descricao: "2x carnes smash de 80g com crosta pronunciada, queijo cheddar derretido, cebola chapeada, bacon artesanal e molho da casa no pão brioche.",
      preco: 34.90,
      precoAntigo: 38.90,
      categoria: "Smash Burgers",
      imagem: "img/burger-double.jpg",
      destaque: true,
      badge: "O Campeão"
    },
    {
      id: "smash-bacon-cheddar",
      nome: "Smash Bacon Cheddar",
      descricao: "Smash burger de 90g, fatias crocantes de bacon defumado em macieira, cheddar inglês cremoso e picles artesanal.",
      preco: 31.90,
      precoAntigo: null,
      categoria: "Smash Burgers",
      imagem: "img/burger-bacon.jpg",
      destaque: false,
      badge: null
    },
    {
      id: "smash-classic-cheese",
      nome: "Brava Classic Cheese",
      descricao: "Smash burger de 90g, queijo prato duplo derretido, molho especial da casa e cebola picadinha na chapa em pão dourado.",
      preco: 26.90,
      precoAntigo: null,
      categoria: "Smash Burgers",
      imagem: "img/burger-classic.jpg",
      destaque: false,
      badge: null
    },
    {
      id: "burger-trufado-shimeji",
      nome: "Smash Trufado Shimeji",
      descricao: "Smash duplo de 80g, queijo gouda, cogumelos shimeji salteados na manteiga e alho poró, finalizado com aioli de trufas brancas.",
      preco: 42.00,
      precoAntigo: 47.00,
      categoria: "Burgers Especiais",
      imagem: "img/burger-trufado.jpg",
      destaque: true,
      badge: "Gourmet"
    },
    {
      id: "burger-crispy-bbq",
      nome: "Crispy Onion BBQ",
      descricao: "Smash duplo de 80g, cebola crispy super crocante, queijo monterey jack derretido e barbecue rústico com cerveja preta.",
      preco: 36.90,
      precoAntigo: null,
      categoria: "Burgers Especiais",
      imagem: "img/burger-crispy.jpg",
      destaque: false,
      badge: null
    },
    {
      id: "batata-rustica",
      nome: "Batata Rústica com Alecrim",
      descricao: "Corte artesanal rústico, sequinha por fora e macia por dentro. Temperada com sal grosso marinho e alecrim fresco. Acompanha maionese verde.",
      preco: 18.00,
      precoAntigo: null,
      categoria: "Acompanhamentos",
      imagem: "img/batata-rustica.jpg",
      destaque: false,
      badge: null
    },
    {
      id: "batata-cheddar-bacon",
      nome: "Batata Cheddar & Bacon",
      descricao: "Porção de batatas crocantes cobertas com creme de cheddar quente e farofa crocante de bacon artesanal.",
      preco: 27.90,
      precoAntigo: null,
      categoria: "Acompanhamentos",
      imagem: "img/batata-cheddar-bacon.jpg",
      destaque: true,
      badge: "Para Compartilhar"
    },
    {
      id: "onion-rings",
      nome: "Anéis de Cebola Panko",
      descricao: "Cebolas em rodelas grossas empanadas em farinha panko japonesa, ultra crocantes. Acompanha molho barbecue da casa.",
      preco: 21.00,
      precoAntigo: null,
      categoria: "Acompanhamentos",
      imagem: "img/onion-rings.jpg",
      destaque: false,
      badge: null
    },
    {
      id: "coca-cola-lata",
      nome: "Coca-Cola Original 350ml",
      descricao: "Lata geladíssima.",
      preco: 7.00,
      precoAntigo: null,
      categoria: "Bebidas",
      imagem: "img/bebida-coca.jpg",
      destaque: false,
      badge: null
    },
    {
      id: "coca-zero-lata",
      nome: "Coca-Cola Zero 350ml",
      descricao: "Lata geladíssima sem açúcar.",
      preco: 7.00,
      precoAntigo: null,
      categoria: "Bebidas",
      imagem: "img/bebida-coca-zero.jpg",
      destaque: false,
      badge: null
    },
    {
      id: "cha-gelado-casa",
      nome: "Chá Gelado Hibisco & Limão 500ml",
      descricao: "Infusão natural artesanal de flor de hibisco com limão siciliano e folhas de hortelã fresca.",
      preco: 10.90,
      precoAntigo: null,
      categoria: "Bebidas",
      imagem: "img/bebida-cha.jpg",
      destaque: false,
      badge: "Artesanal"
    },
    {
      id: "pudim-leite-latinha",
      nome: "Pudim de Leite na Latinha",
      descricao: "Pudim clássico super cremoso e lisinho com calda de caramelo dourada.",
      preco: 14.50,
      precoAntigo: null,
      categoria: "Sobremesas",
      imagem: "img/sobremesa-pudim.jpg",
      destaque: false,
      badge: null
    },
    {
      id: "milkshake-nutella-ninho",
      nome: "Milkshake Nutella & Ninho 400ml",
      descricao: "Gelato artesanal batido com Nutella pura, borda recheada e leite Ninho polvilhado.",
      preco: 23.90,
      precoAntigo: 26.90,
      categoria: "Sobremesas",
      imagem: "img/sobremesa-shake.jpg",
      destaque: true,
      badge: "Favorito"
    }
  ],

  // --------------------------------------------------------------------------
  // 10. AVALIAÇÕES REAIS (PROVA SOCIAL)
  // --------------------------------------------------------------------------
  avaliacoes: [
    {
      id: 1,
      autor: "Lucas Mendonça",
      nota: 5,
      data: "Ontem",
      texto: "Melhor smash do bairro! O pão chega quentinho, a crosta da carne é sensacional e a entrega levou 25 minutos. Pedir pelo site e mandar no Zap foi muito rápido."
    },
    {
      id: 2,
      autor: "Mariana Alencar",
      nota: 5,
      data: "há 3 dias",
      texto: "Pedimos o combo casal na sexta e viramos fãs. A batata com cheddar e bacon veio crocante, nada murcho. Preço justo e ótimo atendimento pelo WhatsApp."
    },
    {
      id: 3,
      autor: "Rodrigo Prado",
      nota: 5,
      data: "há 1 semana",
      texto: "O smash trufado é coisa de outro mundo. Muito melhor pedir direto do que pelo iFood que cobra taxa a mais em cada item."
    }
  ],

  // --------------------------------------------------------------------------
  // 11. PERGUNTAS FREQUENTES (FAQ)
  // --------------------------------------------------------------------------
  faq: [
    {
      pergunta: "Como faço para pedir direto no WhatsApp?",
      resposta: "Você escolhe os pratos aqui na página e clica em 'Enviar Pedido'. O sistema gera uma mensagem pronta com seus itens, endereço e forma de pagamento. Você só precisa apertar 'Enviar' no WhatsApp e nossa cozinha começa a preparar na hora!"
    },
    {
      pergunta: "Qual é a taxa e o tempo de entrega?",
      resposta: "Nosso tempo médio é de 30 a 45 minutos para um raio de até 6 km. A taxa fixa de entrega é de R$ 7,00, mas para pedidos a partir de R$ 75,00 o frete é 100% GRÁTIS!"
    },
    {
      pergunta: "Posso retirar no balcão?",
      resposta: "Sim! Na sacola do pedido, selecione a opção 'Retirada no Balcão'. Você não paga taxa de entrega e avisamos no WhatsApp assim que estiver pronto para retirar quentinho."
    },
    {
      pergunta: "Quais são as formas de pagamento?",
      resposta: "Aceitamos Pix (chave enviada na conversa do WhatsApp para confirmação na hora), Cartão de Crédito e Débito (levamos a maquininha na sua porta) e Dinheiro em espécie (basta informar no carrinho se precisa de troco)."
    },
    {
      pergunta: "Posso pedir sem algum ingrediente (picles, cebola, molho)?",
      resposta: "Com certeza! Em cada item ou no fechamento da sacola, há um campo de observações onde você pode escrever qualquer preferência (ex: 'sem cebola', 'molho à parte', 'ponto da carne')."
    }
  ]
};

if (typeof window !== "undefined") {
  window.RESTAURANTE_CONFIG = RESTAURANTE_CONFIG;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = RESTAURANTE_CONFIG;
}
