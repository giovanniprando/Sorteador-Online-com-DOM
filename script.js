const formulario = document.querySelector('#sorteadorForm');
const listaEntrada = document.querySelector('#listaEntrada');
const resultadoBox = document.querySelector('#resultadoBox');
const resultado = document.querySelector('#resultado');
const btnSortear = document.querySelector('#btnSortear');
const btnLimpar = document.querySelector('#btnLimpar');
const status = document.querySelector('#status');
const naoRepetir = document.querySelector('#naoRepetir');
const historicoContainer = document.querySelector('#historicoContainer');
const historicoLista = document.querySelector('#historicoLista');

function obterItens() {
  return listaEntrada.value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter((item) => item !== '');
}

function sortear(itens) {
  const indiceSorteado = Math.floor(Math.random() * itens.length);
  return {
    vencedor: itens[indiceSorteado],
    indice: indiceSorteado
  };
}

function dispararConfetes() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 90,
      spread: 60,
      origin: { y: 0.6 }
    });
  }
}

function adicionarAoHistorico(vencedor) {
  const itemHistorico = document.createElement('li');
  const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  itemHistorico.textContent = `🏆 ${vencedor} — ${hora}`;

  historicoLista.prepend(itemHistorico);
  historicoContainer.classList.remove('hidden');
}

function exibirResultado(vencedor) {
  resultado.textContent = vencedor;
  resultadoBox.classList.remove('hidden');

  resultado.classList.remove('revelar');
  void resultado.offsetWidth;
  resultado.classList.add('revelar');

  dispararConfetes();
  adicionarAoHistorico(vencedor);
}

function executarSorteio() {
  const itens = obterItens();

  if (itens.length === 0) {
    resultadoBox.classList.add('hidden');
    status.textContent = '❌ Digite ao menos um item para sortear!';
    listaEntrada.focus();
    return;
  }

  const { vencedor, indice } = sortear(itens);

  let contador = 3;
  btnSortear.disabled = true;
  btnLimpar.disabled = true;
  resultadoBox.classList.add('hidden');
  status.textContent = `⏱️ SORTEANDO EM: ${contador}...`;

  const intervalo = setInterval(() => {
    contador -= 1;
    if (contador > 0) {
      status.textContent = `⏱️ SORTEANDO EM: ${contador}...`;
    } else {
      clearInterval(intervalo);
      status.textContent = '';
      btnSortear.disabled = false;
      btnLimpar.disabled = false;

      if (naoRepetir.checked) {
        itens.splice(indice, 1);
        listaEntrada.value = itens.join(', ');
      }

      exibirResultado(vencedor);
    }
  }, 500);
}

formulario.addEventListener('submit', (event) => {
  event.preventDefault();
  status.textContent = '';
  executarSorteio();
});

btnLimpar.addEventListener('click', () => {
  listaEntrada.value = '';
  resultado.textContent = '---';
  resultadoBox.classList.add('hidden');
  historicoContainer.classList.add('hidden');
  historicoLista.innerHTML = '';
  status.textContent = '';
  listaEntrada.focus();
});