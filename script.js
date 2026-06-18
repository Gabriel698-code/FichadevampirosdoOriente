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

    // --- 4. GERAÇÃO DO PDF (CAPTURA EXATA DA TELA) ---
    const botaoGerarPdf = document.getElementById('btn-gerar-pdf');

    // Usamos 'async' para lidar com o processo de criação do PDF de forma mais fluida
    botaoGerarPdf.addEventListener('click', async function() {

        const ficha = document.getElementById('ficha-personagem');

        // Novas opções que usam a altura e largura reais da ficha
        const opt = {
            margin: 0, // Sem margens artificiais, o CSS já cuida do espaço interno
            filename: 'ficha_vampiro_oriente.pdf',
            image: {
                type: 'jpeg',
                quality: 1 // Qualidade máxima de imagem
            },
            html2canvas: {
                scale: 2, // Mantém a alta resolução
                useCORS: true,
                logging: false, // Esconde mensagens desnecessárias no console (F12)
                letterRendering: true // Melhora o desenho das letras da fonte
            },
            jsPDF: {
                unit: 'px', // Usa "pixels" em vez de "milímetros"
                // O grande truque: o PDF terá a largura e altura exatas do elemento HTML
                format: [ficha.scrollWidth, ficha.scrollHeight], 
                orientation: 'portrait'
            }
        };

        // Roda a biblioteca com as nossas novas opções infalíveis
        html2pdf()
            .set(opt)
            .from(ficha)
            .save();
    });

});
