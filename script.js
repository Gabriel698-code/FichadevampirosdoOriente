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

    // --- 4. GERAÇÃO DO PDF (ESTÁVEL E COMPATÍVEL COM O NOVO CSS) ---
    const botaoGerarPdf = document.getElementById('btn-gerar-pdf');
    
    botaoGerarPdf.addEventListener('click', function() {
        const elementoFicha = document.getElementById('ficha-personagem');
        
        const opcoes = {
            margin:       [5, 5, 5, 5], // Margem de segurança de 5mm nos 4 cantos
            filename:     'ficha_vampiro_oriente.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
                scale: 2, 
                useCORS: true,
                scrollY: 0 // Evita que a câmera desloque caso a página tenha rolagem
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        // Executa a renderização limpa
        html2pdf().set(opcoes).from(elementoFicha).save();
    });

});
