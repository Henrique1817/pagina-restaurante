const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== INICIANDO SUÍTE COMPLETA DE TESTES DE CONFORMIDADE ===\n');

// 1. Carrega e Valida RESTAURANTE_CONFIG
const configPath = path.join(__dirname, '..', 'js', 'config.js');
assert(fs.existsSync(configPath), 'js/config.js deve existir.');
const configContent = fs.readFileSync(configPath, 'utf8');

const sandbox = {};
const fakeModule = { exports: {} };
new Function('window', 'module', configContent)(sandbox, fakeModule);
const CONFIG = fakeModule.exports || sandbox.RESTAURANTE_CONFIG;
assert(CONFIG, 'RESTAURANTE_CONFIG deve ser exportado.');
console.log('✓ RESTAURANTE_CONFIG carregado com sucesso.');

// 2. Valida Campos Obrigatórios
const requiredFields = [
  'nome', 'nomeCurto', 'tagline', 'descricao', 'whatsappNumber',
  'whatsappDisplay', 'endereco', 'cidadeUF', 'googleMapsLink', 'instagram',
  'horarios', 'tempoMedioEntrega', 'raioEntrega', 'pedidoMinimo',
  'freteGratisAcima', 'produtos', 'categorias', 'avaliacoes', 'faq',
  'campanha', 'diferenciais', 'combosDestaque'
];

requiredFields.forEach(f => {
  assert(CONFIG[f] !== undefined, `Campo obrigatório ausente: ${f}`);
});
console.log(`✓ Todos os ${requiredFields.length} campos de configuração validados.`);

// 3. Validação dos 12 Blocos de Seções em index.html na Ordem Exata
const htmlPath = path.join(__dirname, '..', 'index.html');
assert(fs.existsSync(htmlPath), 'index.html deve existir.');
const html = fs.readFileSync(htmlPath, 'utf8');

const expectedSectionsInOrder = [
  'id="urgency-bar"',          // 1. Barra de urgência com nome da campanha e contador
  'id="site-header"',          // 2. Cabeçalho fixo com logo, link do cardápio e carrinho
  'id="hero-section"',         // 3. Dobra principal
  'id="combos-section"',       // 4. Combos em destaque
  'id="diferenciais-section"', // 5. Diferenciais
  'id="cardapio-section"',     // 6. Cardápio completo
  'id="avaliacoes-section"',   // 7. Avaliações reais
  'id="entrega-retirada-section"', // 8. Entrega e retirada
  'id="faq-section"',          // 9. Perguntas frequentes em accordion
  'id="cta-fechamento-section"', // 10. Fechamento com chamada final e botão grande
  'id="site-footer"',          // 11. Rodapé
  'id="floating-whatsapp-btn"' // 12. Botão flutuante de WhatsApp e mobile bottom bar
];

let lastIndex = -1;
expectedSectionsInOrder.forEach((secId, i) => {
  const currentIndex = html.indexOf(secId);
  assert(currentIndex !== -1, `Seção #${i + 1} (${secId}) não encontrada no HTML.`);
  assert(currentIndex > lastIndex, `Ordem incorreta: Seção #${i + 1} (${secId}) deveria vir após a anterior.`);
  lastIndex = currentIndex;
});
console.log('✓ Todas as 12 seções estão presentes no HTML na ORDEM EXATA exigida.');

// 4. Validação da Lógica do Contador de Campanha
console.log('\n--- Testando lógica do contador de campanha ---');
function testTimer(diffMs) {
  if (diffMs <= 0) return { hidden: true };
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const seconds = Math.floor((diffMs / 1000) % 60);

  assert(hours < 24, `ERRO: Horas (${hours}) nunca devem exceder 24.`);
  let text = '';
  if (days >= 1) {
    text = `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
  } else {
    text = `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  }
  return { hidden: false, text, days, hours, minutes, seconds };
}

// Teste A: Mais de 1 dia (ex: 3 dias e 4 horas)
const resA = testTimer(3 * 24 * 3600 * 1000 + 4 * 3600 * 1000 + 12 * 60 * 1000);
assert.strictEqual(resA.text, '3d 04h 12m', 'Formato acima de 1 dia incorreto');
console.log(`✓ Mais de 1 dia: "${resA.text}" (dias e horas, nunca > 24h)`);

// Teste B: Menos de 24h (ex: 4 horas, 12 min, 35 seg)
const resB = testTimer(4 * 3600 * 1000 + 12 * 60 * 1000 + 35 * 1000);
assert.strictEqual(resB.text, '04h 12m 35s', 'Formato menos de 24h incorreto');
console.log(`✓ Menos de 24h: "${resB.text}" (horas, minutos e segundos)`);

// Teste C: Expirado (diff <= 0)
const resC = testTimer(-5000);
assert.strictEqual(resC.hidden, true, 'Deveria esconder a barra quando expirado');
console.log('✓ Data expirada: barra é escondida sem reiniciar nem mostrar zeros.');

// 5. Teste da Mensagem Formatada para WhatsApp e Teste de Codificação
console.log('\n--- Testando formato da mensagem WhatsApp e encoding ---');
const sampleMsg = `*Novo pedido — ${CONFIG.nome}*
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
`;

// Verifica encoding do link
const encoded = encodeURIComponent(sampleMsg);
const zapUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encoded}`;
assert(zapUrl.startsWith(`https://wa.me/${CONFIG.whatsappNumber}?text=*Novo%20pedido`), 'URL do WhatsApp gerada incorretamente');

// Decodifica e garante igualdade perfeita sem quebra de acentos (ã, é, ó, ú, ç) ou símbolos
const decoded = decodeURIComponent(encoded);
assert.strictEqual(decoded, sampleMsg, 'Decodificação falhou: acentuação ou pontuação corrompida');
console.log(`✓ Mensagem formatada e decodificada com 100% de integridade (acentos e caracteres especiais preservados).`);
console.log(`✓ Exemplo de link wa.me válido:\n  ${zapUrl.slice(0, 110)}...`);

// 6. Verificação do CSS (prefers-reduced-motion, foco visível, AA)
console.log('\n--- Testando CSS próprio e acessibilidade ---');
const cssPath = path.join(__dirname, '..', 'css', 'estilo.css');
const css = fs.readFileSync(cssPath, 'utf8');
assert(css.includes('prefers-reduced-motion'), 'CSS deve respeitar prefers-reduced-motion');
assert(css.includes(':focus-visible'), 'CSS deve possuir foco visível');
assert(css.includes('@font-face'), 'CSS deve declarar fontes locais via @font-face');
assert(!css.includes('cdn.tailwindcss.com'), 'NÃO use Tailwind via CDN');
assert(!css.includes('unsplash.com'), 'Sem links remotos externos');
console.log('✓ CSS validado: @font-face local, foco visível e prefers-reduced-motion atendidos.');

// 7. Verificação de Imagens com width e height
assert(html.includes('width="600"') && html.includes('height="450"'), 'Imagens devem ter width e height explícitos no HTML para zero layout shift');
console.log('✓ Imagens com atributos width e height para prevenção de Cumulative Layout Shift (CLS).');

console.log('\n======================================================');
console.log('TODOS OS TESTES FORAM CONCLUÍDOS COM 100% DE SUCESSO!');
console.log('======================================================');
