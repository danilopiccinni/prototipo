document.addEventListener('DOMContentLoaded', function() {
    const larghezzaInput = document.getElementById('larghezza');
    const altezzaInput = document.getElementById('altezza');
    const aggiornaBtn = document.getElementById('aggiorna');
    const scaricaBtn = document.getElementById('scarica-pdf');

    // Elementi da aggiornare
    const quotaLarghezzaPorta = document.getElementById('quota-larghezza-porta');
    const quotaAltezzaPorta = document.getElementById('quota-altezza-porta');
    const quotaLarghezzaVano = document.getElementById('quota-larghezza-vano');
    const quotaAltezzaVano = document.getElementById('quota-altezza-vano');

    const valLarghezzaPorta = document.getElementById('val-larghezza-porta');
    const valAltezzaPorta = document.getElementById('val-altezza-porta');
    const valLarghezzaVano = document.getElementById('val-larghezza-vano');
    const valAltezzaVano = document.getElementById('val-altezza-vano');

    // Valori iniziali
    let larghezzaPorta = 200;
    let altezzaPorta = 160;
    let larghezzaVano = 500;
    let altezzaVano = 300;
    let larghezzaControtelaio = 0;

    // Elementi SVG
    const svg = document.getElementById('disegno');
    const pavimento = document.getElementById('pavimento');
    const muro = document.getElementById('muro');
    const controtelaio = document.getElementById('controtelaio');
    const porta = document.getElementById('porta');
    const portaChiusa = document.getElementById('porta-chiusa');
    const binario = document.getElementById('binario');

    const lineaLarghezzaPorta = document.getElementById('linea-larghezza-porta');
    const tickLp1 = document.getElementById('tick-lp1');
    const tickLp2 = document.getElementById('tick-lp2');
    const lineaAltezzaPorta = document.getElementById('linea-altezza-porta');
    const tickAp1 = document.getElementById('tick-ap1');
    const tickAp2 = document.getElementById('tick-ap2');
    const lineaLarghezzaVano = document.getElementById('linea-larghezza-vano');
    const tickLv1 = document.getElementById('tick-lv1');
    const tickLv2 = document.getElementById('tick-lv2');
    const lineaAltezzaVano = document.getElementById('linea-altezza-vano');
    const tickAv1 = document.getElementById('tick-av1');
    const tickAv2 = document.getElementById('tick-av2');

    // Scala: 1 cm = 2 px
    const scale = 2;
    const margine = 50;
    const spessoreMuro = 25; // px
    const pavimentoY = 350;
    const margineSopraPorta = 20; // px (binario)

    function aggiornaConfigurazione() {
        const larg = parseFloat(larghezzaInput.value) || 0;
        const alt = parseFloat(altezzaInput.value) || 0;

        if (larg > 0 && alt > 0) {
            larghezzaPorta = larg;
            altezzaPorta = alt;

            const portaWidthPx = larghezzaPorta * scale;
            const portaHeightPx = altezzaPorta * scale;

            const controtelaioWidthPx = portaWidthPx * 2;
            const controtelaioHeightPx = portaHeightPx + margineSopraPorta;

            const muroWidthPx = controtelaioWidthPx + 2 * spessoreMuro;
            const muroHeightPx = controtelaioHeightPx + spessoreMuro;

            larghezzaControtelaio = controtelaioWidthPx / scale;
            larghezzaVano = muroWidthPx / scale;
            altezzaVano = muroHeightPx / scale;

            /* =============================
               POSIZIONAMENTO DA PAVIMENTO
            ============================== */
            const muroX = margine;
            const muroY = pavimentoY - muroHeightPx;

            muro.setAttribute('x', muroX);
            muro.setAttribute('y', muroY);
            muro.setAttribute('width', muroWidthPx);
            muro.setAttribute('height', muroHeightPx);

            // Controtelaio appoggiato a terra
            const controtelaioX = muroX + spessoreMuro;
            const controtelaioY = pavimentoY - controtelaioHeightPx;

            controtelaio.setAttribute('x', controtelaioX);
            controtelaio.setAttribute('y', controtelaioY);
            controtelaio.setAttribute('width', controtelaioWidthPx);
            controtelaio.setAttribute('height', controtelaioHeightPx);

            // Porta appoggiata a terra
            const portaX = controtelaioX + 10;
            const portaY = pavimentoY - portaHeightPx;

            porta.setAttribute('x', portaX);
            porta.setAttribute('y', portaY);
            porta.setAttribute('width', portaWidthPx);
            porta.setAttribute('height', portaHeightPx);

            // Porta chiusa (a destra)
            const portaChiusaX = controtelaioX + controtelaioWidthPx - portaWidthPx - 10;

            portaChiusa.setAttribute('x', portaChiusaX);
            portaChiusa.setAttribute('y', portaY);
            portaChiusa.setAttribute('width', portaWidthPx);
            portaChiusa.setAttribute('height', portaHeightPx);

            // Binario sopra la porta
            const binarioY = portaY - margineSopraPorta;

            binario.setAttribute('x1', controtelaioX);
            binario.setAttribute('x2', controtelaioX + controtelaioWidthPx);
            binario.setAttribute('y1', binarioY);
            binario.setAttribute('y2', binarioY);

            // Pavimento
            pavimento.setAttribute('x1', 0);
            pavimento.setAttribute('y1', pavimentoY);
            pavimento.setAttribute('x2', muroX + muroWidthPx + margine);
            pavimento.setAttribute('y2', pavimentoY);

            /* =============================
               TESTI
            ============================== */
            quotaLarghezzaPorta.textContent = larghezzaPorta + ' cm';
            quotaAltezzaPorta.textContent = altezzaPorta + ' cm';
            quotaLarghezzaVano.textContent = larghezzaControtelaio + ' cm';
            quotaAltezzaVano.textContent = altezzaVano + ' cm';

            valLarghezzaPorta.textContent = larghezzaPorta;
            valAltezzaPorta.textContent = altezzaPorta;
            valLarghezzaVano.textContent = larghezzaControtelaio;
            valAltezzaVano.textContent = altezzaVano;

            /* =============================
               FIX VIEWBOX DINAMICO
               per evitare tagli porta alta
            ============================== */
            const totalWidth = muroX + muroWidthPx + margine;
            const minY = Math.min(muroY, binarioY - 20);
            const totalHeight = pavimentoY + 50 - minY;

            svg.setAttribute('viewBox', `0 ${minY} ${totalWidth} ${totalHeight}`);
        }
    }

    aggiornaBtn.addEventListener('click', aggiornaConfigurazione);
    larghezzaInput.addEventListener('input', aggiornaConfigurazione);
    altezzaInput.addEventListener('input', aggiornaConfigurazione);

    aggiornaConfigurazione();
});
