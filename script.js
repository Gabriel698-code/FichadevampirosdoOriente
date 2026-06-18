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
            return;
        }

        elementos.forEach((el, i) => {
            if (i <= indiceClicado) {
                el.classList.add('filled');
            } else {
                el.classList.remove('filled');
            }
        });
    }

    // --- 4. GERAÇÃO DO PDF (VERSÃO A4 CORRIGIDA E BLINDADA) ---
    const botaoGerarPdf = document.getElementById('btn-gerar-pdf');
    
    botaoGerarPdf.addEventListener('click', function() {
        const elementoFicha = document.getElementById('ficha-personagem');
        
        // 1. SALVA AS CONFIGURAÇÕES ORIGINAIS
        const margemOriginal = elementoFicha.style.margin;
        const posicaoOriginal = elementoFicha.style.position;
        const leftOriginal = elementoFicha.style.left;
        const topOriginal = elementoFicha.style.top;

        // 2. TRUQUE NINJA: Prende a ficha no canto superior esquerdo (Ponto Zero)
        elementoFicha.style.margin = '0';
        elementoFicha.style.position = 'absolute';
        elementoFicha.style.left = '0';
        elementoFicha.style.top = '0';
        
        // 3. OPÇÕES PARA FORMATO A4
        const opcoes = {
            margin:       [5, 5, 5, 5], // 5mm de borda branca nas laterais da folha A4
            filename:     'ficha_vampiro_oriente_A4.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
                scale: 2, 
                useCORS: true,
                scrollX: 0, 
                scrollY: 0 
                // Sem windowWidth, a biblioteca vai ler o tamanho exato da ficha colada no canto
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' } 
        }; 
        
        // 4. GERA O PDF E DEVOLVE A FICHA PARA O LUGAR
        html2pdf()
            .set(opcoes)
            .from(elementoFicha)
            .save()
            .then(() => {
                // Quando o download terminar, restaura o visual centralizado original
                elementoFicha.style.margin = margemOriginal;
                elementoFicha.style.position = posicaoOriginal;
                elementoFicha.style.left = leftOriginal;
                elementoFicha.style.top = topOriginal;
            });
    });

}); // Fim do documento
