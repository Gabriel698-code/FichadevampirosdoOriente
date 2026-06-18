// Aguarda todo o HTML da página ser carregado antes de rodar o código
document.addEventListener("DOMContentLoaded", function() {

    // --- 1. LÓGICA DAS BOLINHAS (DOTS) ---
    // Encontra todos os espaços reservados para bolinhas no HTML
    const conteineresBolinhas = document.querySelectorAll('.dots');
    
    conteineresBolinhas.forEach(conteiner => {
        // Lê quantas bolinhas aquele atributo precisa (8 ou 10)
        const maximo = parseInt(conteiner.getAttribute('data-max'));
        
        // Laço de repetição: Cria a quantidade certa de bolinhas
        for (let i = 0; i < maximo; i++) {
            const bolinha = document.createElement('div');
            bolinha.classList.add('dot'); // Adiciona o estilo do CSS
            
            // Adiciona a inteligência do clique
            bolinha.addEventListener('click', function() {
                preencherElementos(conteiner, '.dot', i);
            });
            
            // Coloca a bolinha dentro do HTML
            conteiner.appendChild(bolinha);
        }
    });

    // --- 2. LÓGICA DOS QUADRADOS (SQUARES) ---
    // Encontra os espaços reservados para quadrados (Força de Vontade, Chi)
    const conteineresQuadrados = document.querySelectorAll('.squares');
    
    conteineresQuadrados.forEach(conteiner => {
        const maximo = parseInt(conteiner.getAttribute('data-max'));
        
        for (let i = 0; i < maximo; i++) {
            const quadrado = document.createElement('div');
            quadrado.classList.add('square'); // Adiciona o estilo do CSS
            
            // Adiciona a inteligência do clique
            quadrado.addEventListener('click', function() {
                preencherElementos(conteiner, '.square', i);
            });
            
            conteiner.appendChild(quadrado);
        }
    });

    // --- 3. FUNÇÃO DE PREENCHIMENTO (A REGRA DO RPG) ---
    function preencherElementos(conteiner, classeElemento, indiceClicado) {
        // Pega todos os itens (bolinhas ou quadrados) daquela linha específica
        const elementos = conteiner.querySelectorAll(classeElemento);
        
        // Verifica se o item clicado já é o último que estava pintado
        // Isso serve para o jogador poder "zerar" o atributo se errar
        let clicouNoUltimoPreenchido = true;
        for (let i = 0; i <= indiceClicado; i++) {
            if (!elementos[i].classList.contains('filled')) {
                clicouNoUltimoPreenchido = false;
            }
        }
        if (indiceClicado < elementos.length - 1 && elementos[indiceClicado + 1].classList.contains('filled')) {
            clicouNoUltimoPreenchido = false;
        }

        // Se clicou exatamente no último nível preenchido, limpa tudo
        if (clicouNoUltimoPreenchido) {
            elementos.forEach(el => el.classList.remove('filled'));
            return; // Interrompe a função aqui
        }

        // Caso contrário, preenche até o número clicado e esvazia os da frente
        elementos.forEach((el, i) => {
            if (i <= indiceClicado) {
                el.classList.add('filled'); // Pinta de preto
            } else {
                el.classList.remove('filled'); // Deixa em branco
            }
        });
    }

    // --- 4. GERAÇÃO DO PDF ---
    const botaoGerarPdf = document.getElementById('btn-gerar-pdf');
    
    botaoGerarPdf.addEventListener('click', function() {
        // Seleciona apenas a parte da ficha (ignorando o próprio botão)
        const elementoFicha = document.getElementById('ficha-personagem');
        
        // Configurações visuais do PDF
        const opcoes = {
            margin:       [10, 10, 10, 10], // Margens do papel
            filename:     'ficha_vampiro_oriente.pdf', // Nome do arquivo baixado
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 }, // Melhora a resolução do PDF
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' } // Formato A4 padrão
        };
        
        // O comando mágico da biblioteca que faz a conversão e o download
        html2pdf().set(opcoes).from(elementoFicha).save();
    });

});
