// Aguarda todo o HTML da página ser carregado antes de rodar o código
document.addEventListener("DOMContentLoaded", function() {

    // --- 1. LÓGICA DAS BOLINHAS (DOTS) ---
    const conteineresBolinhas = document.querySelectorAll('.dots');
    
    conteineresBolinhas.forEach(conteiner => {
        const maximo = parseInt(conteiner.getAttribute('data-max'));
        for (let i = 0; i < maximo; i++) {
            const bolinha = document.createElement('div');
            bolinha.classList.add('dot');
            bolinha.addEventListener('click', function() {
                preencherElementos(conteiner, '.dot', i);
            });
            conteiner.appendChild(bolinha);
        }
    });

    // --- 2. LÓGICA DOS QUADRADOS (SQUARES) ---
    const conteineresQuadrados = document.querySelectorAll('.squares');
    
    conteineresQuadrados.forEach(conteiner => {
        const maximo = parseInt(conteiner.getAttribute('data-max'));
        for (let i = 0; i < maximo; i++) {
            const quadrado = document.createElement('div');
            quadrado.classList.add('square');
            quadrado.addEventListener('click', function() {
                preencherElementos(conteiner, '.square', i);
            });
            conteiner.appendChild(quadrado);
        }
    });

    // --- 3. FUNÇÃO DE PREENCHIMENTO ---
    function preencherElementos(conteiner, classeElemento, indiceClicado) {
        const elementos = conteiner.querySelectorAll(classeElemento);
        
        let clicouNoUltimoPreenchido = true;
        for (let i = 0; i <= indiceClicado; i++) {
            if (!elementos[i].classList.contains('filled')) {
                clicouNoUltimoPreenchido = false;
            }
        }
        if (indiceClicado < elementos.length - 1 && elementos[indiceClicado + 1].classList.contains('filled')) {
            clicouNoUltimoPreenchido = false;
        }

        if (clicouNoUltimoPreenchido) {
            elementos.forEach(el => el.classList.remove('filled'));
            salvarDados(); // Salva sempre que apagar
            return;
        }

        elementos.forEach((el, i) => {
            if (i <= indiceClicado) {
                el.classList.add('filled');
            } else {
                el.classList.remove('filled');
            }
        });
        
        salvarDados(); // Salva sempre que pintar uma bolinha/quadrado
    }

    // --- 4. GERAÇÃO DO PDF ---
    const botaoGerarPdf = document.getElementById('btn-gerar-pdf');
    
    botaoGerarPdf.addEventListener('click', function() {
        const elementoFicha = document.getElementById('ficha-personagem');
        
        const opcoes = {
            margin:       [5, 5, 5, 5], 
            filename:     'ficha_vampiro_oriente.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
                scale: 2, 
                useCORS: true,
                scrollY: 0 
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        html2pdf().set(opcoes).from(elementoFicha).save();
    });

    // --- 5. SISTEMA DE SALVAMENTO AUTOMÁTICO (MEMÓRIA) ---
    
    // Função que "tira uma foto" de todos os dados e guarda no navegador
    function salvarDados() {
        const inputsText = Array.from(document.querySelectorAll('input[type="text"]')).map(input => input.value);
        const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]')).map(cb => cb.checked);
        const bolinhas = Array.from(document.querySelectorAll('.dot')).map(dot => dot.classList.contains('filled'));
        const quadrados = Array.from(document.querySelectorAll('.square')).map(sq => sq.classList.contains('filled'));

        // Empacota tudo numa caixa chamada "fichaData"
        const fichaData = { inputsText, checkboxes, bolinhas, quadrados };
        
        // Guarda a caixa no cofre do navegador
        localStorage.setItem('dadosVampiroOriente', JSON.stringify(fichaData));
    }

    // Função que abre o cofre e preenche a ficha assim que o site carrega
    function carregarDados() {
        const dadosSalvos = localStorage.getItem('dadosVampiroOriente');
        if (!dadosSalvos) return; // Se for a primeira vez do jogador, não faz nada

        const data = JSON.parse(dadosSalvos);

        // Preenche os textos
        document.querySelectorAll('input[type="text"]').forEach((input, i) => {
            if (data.inputsText[i] !== undefined) input.value = data.inputsText[i];
        });

        // Marca as caixinhas de vitalidade
        document.querySelectorAll('input[type="checkbox"]').forEach((cb, i) => {
            if (data.checkboxes[i] !== undefined) cb.checked = data.checkboxes[i];
        });

        // Pinta as bolinhas
        document.querySelectorAll('.dot').forEach((dot, i) => {
            if (data.bolinhas[i]) dot.classList.add('filled');
        });

        // Pinta os quadrados
        document.querySelectorAll('.square').forEach((sq, i) => {
            if (data.quadrados[i]) sq.classList.add('filled');
        });
    }

    // Aciona o salvamento automático sempre que o jogador digitar qualquer coisa
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', salvarDados);
        input.addEventListener('change', salvarDados);
    });

    // Botão de Limpar a Ficha
    const botaoLimpar = document.getElementById('btn-limpar');
    if (botaoLimpar) {
        botaoLimpar.addEventListener('click', function() {
            // Pergunta de segurança para não apagar sem querer
            if (confirm("Tem certeza que deseja apagar toda a ficha e começar do zero?")) {
                localStorage.removeItem('dadosVampiroOriente'); // Esvazia o cofre
                location.reload(); // Recarrega a página em branco
            }
        });
    }

    // Roda a função de carregar assim que o JavaScript termina de ligar as bolinhas
    carregarDados();

});
