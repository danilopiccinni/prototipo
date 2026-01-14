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
    const spessoreMuro = 25; // in px
    const pavimentoY = 350;
    const margineLateraleVano = 50; // cm per lato per scorrimento
    const margineSopraPorta = 20; // px per binario
    const margineSottoPorta = 10; // px

    function aggiornaConfigurazione() {
        const larg = parseFloat(larghezzaInput.value) || 0;
        const alt = parseFloat(altezzaInput.value) || 0;

        if (larg > 0 && alt > 0) {
            larghezzaPorta = larg;
            altezzaPorta = alt;
            // Dimensioni in px
            const portaWidthPx = larghezzaPorta * scale;
            const portaHeightPx = altezzaPorta * scale;
            const controtelaioWidthDesiderata = portaWidthPx * 2; // doppio della porta per spazio scorrimento
            const muroWidthPx = controtelaioWidthDesiderata + 2 * spessoreMuro;
            const controtelaioHeightPx = margineSopraPorta + portaHeightPx + margineSottoPorta;
            const muroHeightPx = controtelaioHeightPx + 2 * spessoreMuro;
            const larghezzaVanoCalcolata = muroWidthPx / scale;
            const altezzaVanoCalcolata = muroHeightPx / scale;

            // Aggiorna vano
            larghezzaVano = larghezzaVanoCalcolata;
            altezzaVano = altezzaVanoCalcolata;

            // Posizioni dal pavimento
            const muroX = margine;
            const muroY = pavimentoY - muroHeightPx;

            muro.setAttribute('x', muroX);
            muro.setAttribute('y', muroY);
            muro.setAttribute('width', muroWidthPx);
            muro.setAttribute('height', muroHeightPx);

            const controtelaioX = muroX + spessoreMuro;
            const controtelaioY = muroY + spessoreMuro;
            const controtelaioWidth = muroWidthPx - 2 * spessoreMuro;
            const controtelaioHeight = controtelaioHeightPx;
            const larghezzaControtelaio = controtelaioWidth / scale;

            controtelaio.setAttribute('x', controtelaioX);
            controtelaio.setAttribute('y', controtelaioY);
            controtelaio.setAttribute('width', controtelaioWidth);
            controtelaio.setAttribute('height', controtelaioHeight);

            // Porta posizionata a sinistra del controtelaio
            const marginePorta = 10; // px dal bordo
            const portaX = controtelaioX + marginePorta;
            const portaY = controtelaioY + margineSopraPorta;

            porta.setAttribute('x', portaX);
            porta.setAttribute('y', portaY);
            porta.setAttribute('width', portaWidthPx);
            porta.setAttribute('height', portaHeightPx);

            // Porta chiusa (a destra, trasparente)
            const portaChiusaX = controtelaioX + controtelaioWidth - portaWidthPx - marginePorta;
            portaChiusa.setAttribute('x', portaChiusaX);
            portaChiusa.setAttribute('y', portaY);
            portaChiusa.setAttribute('width', portaWidthPx);
            portaChiusa.setAttribute('height', portaHeightPx);

            // Binario in cima al controtelaio
            const binarioY = controtelaioY;
            binario.setAttribute('x1', controtelaioX);
            binario.setAttribute('y1', binarioY);
            binario.setAttribute('x2', controtelaioX + controtelaioWidth);
            binario.setAttribute('y2', binarioY);

            // Quote larghezza porta
            const yQuotaLp = portaY + portaHeightPx + 20;
            lineaLarghezzaPorta.setAttribute('x1', portaX);
            lineaLarghezzaPorta.setAttribute('y1', yQuotaLp);
            lineaLarghezzaPorta.setAttribute('x2', portaX + portaWidthPx);
            lineaLarghezzaPorta.setAttribute('y2', yQuotaLp);
            tickLp1.setAttribute('x1', portaX);
            tickLp1.setAttribute('x2', portaX);
            tickLp1.setAttribute('y1', yQuotaLp - 5);
            tickLp1.setAttribute('y2', yQuotaLp + 5);
            tickLp2.setAttribute('x1', portaX + portaWidthPx);
            tickLp2.setAttribute('x2', portaX + portaWidthPx);
            tickLp2.setAttribute('y1', yQuotaLp - 5);
            tickLp2.setAttribute('y2', yQuotaLp + 5);
            quotaLarghezzaPorta.setAttribute('x', portaX + portaWidthPx / 2);
            quotaLarghezzaPorta.setAttribute('y', yQuotaLp - 5);

            // Quote altezza porta
            const xQuotaAp = portaX + portaWidthPx + 20;
            lineaAltezzaPorta.setAttribute('x1', xQuotaAp);
            lineaAltezzaPorta.setAttribute('y1', portaY);
            lineaAltezzaPorta.setAttribute('x2', xQuotaAp);
            lineaAltezzaPorta.setAttribute('y2', portaY + portaHeightPx);
            tickAp1.setAttribute('x1', xQuotaAp - 5);
            tickAp1.setAttribute('x2', xQuotaAp + 5);
            tickAp1.setAttribute('y1', portaY);
            tickAp1.setAttribute('y2', portaY);
            tickAp2.setAttribute('x1', xQuotaAp - 5);
            tickAp2.setAttribute('x2', xQuotaAp + 5);
            tickAp2.setAttribute('y1', portaY + portaHeightPx);
            tickAp2.setAttribute('y2', portaY + portaHeightPx);
            quotaAltezzaPorta.setAttribute('x', xQuotaAp + 15);
            quotaAltezzaPorta.setAttribute('y', portaY + portaHeightPx / 2);
            quotaAltezzaPorta.setAttribute('transform', `rotate(90 ${xQuotaAp + 15} ${portaY + portaHeightPx / 2})`);

            // Quote larghezza controtelaio
            const yQuotaLv = pavimentoY + 20;
            lineaLarghezzaVano.setAttribute('x1', controtelaioX);
            lineaLarghezzaVano.setAttribute('y1', yQuotaLv);
            lineaLarghezzaVano.setAttribute('x2', controtelaioX + controtelaioWidth);
            lineaLarghezzaVano.setAttribute('y2', yQuotaLv);
            tickLv1.setAttribute('x1', controtelaioX);
            tickLv1.setAttribute('x2', controtelaioX);
            tickLv1.setAttribute('y1', yQuotaLv - 5);
            tickLv1.setAttribute('y2', yQuotaLv + 5);
            tickLv2.setAttribute('x1', controtelaioX + controtelaioWidth);
            tickLv2.setAttribute('x2', controtelaioX + controtelaioWidth);
            tickLv2.setAttribute('y1', yQuotaLv - 5);
            tickLv2.setAttribute('y2', yQuotaLv + 5);
            quotaLarghezzaVano.setAttribute('x', controtelaioX + controtelaioWidth / 2);
            quotaLarghezzaVano.setAttribute('y', yQuotaLv - 5);

            // Quote altezza vano
            const xQuotaAv = muroX + muroWidthPx + 20;
            lineaAltezzaVano.setAttribute('x1', xQuotaAv);
            lineaAltezzaVano.setAttribute('y1', muroY);
            lineaAltezzaVano.setAttribute('x2', xQuotaAv);
            lineaAltezzaVano.setAttribute('y2', muroY + muroHeightPx);
            tickAv1.setAttribute('x1', xQuotaAv - 5);
            tickAv1.setAttribute('x2', xQuotaAv + 5);
            tickAv1.setAttribute('y1', muroY);
            tickAv1.setAttribute('y2', muroY);
            tickAv2.setAttribute('x1', xQuotaAv - 5);
            tickAv2.setAttribute('x2', xQuotaAv + 5);
            tickAv2.setAttribute('y1', muroY + muroHeightPx);
            tickAv2.setAttribute('y2', muroY + muroHeightPx);
            quotaAltezzaVano.setAttribute('x', xQuotaAv + 15);
            quotaAltezzaVano.setAttribute('y', muroY + muroHeightPx / 2);

            // Aggiorna viewBox e dimensioni SVG
            const totalWidth = muroX + muroWidthPx + margine;
            const minY = muroY;
            const totalHeight = pavimentoY - muroY + 50;
            svg.setAttribute('viewBox', `0 ${minY} ${totalWidth} ${totalHeight}`);

            // Aggiorna pavimento
            pavimento.setAttribute('x1', 0);
            pavimento.setAttribute('y1', pavimentoY);
            pavimento.setAttribute('x2', totalWidth);
            pavimento.setAttribute('y2', pavimentoY);

            // Aggiorna testi
            quotaLarghezzaPorta.textContent = larghezzaPorta + ' cm';
            quotaAltezzaPorta.textContent = altezzaPorta + ' cm';
            quotaLarghezzaVano.textContent = larghezzaControtelaio + ' cm';
            quotaAltezzaVano.textContent = altezzaVano + ' cm';

            // Aggiorna riepilogo
            valLarghezzaPorta.textContent = larghezzaPorta;
            valAltezzaPorta.textContent = altezzaPorta;
            valLarghezzaVano.textContent = larghezzaControtelaio;
            valAltezzaVano.textContent = altezzaVano;
        }
    }

    aggiornaBtn.addEventListener('click', aggiornaConfigurazione);

    // Aggiornamento automatico quando si cambia input
    larghezzaInput.addEventListener('input', aggiornaConfigurazione);
    altezzaInput.addEventListener('input', aggiornaConfigurazione);

    // Hover su quote per tooltip
    const quoteElements = document.querySelectorAll('#quote text');
    quoteElements.forEach(el => {
        el.setAttribute('title', 'Misura calcolata automaticamente');
    });

    // Simulazione download PDF
    scaricaBtn.addEventListener('click', function() {
        // Simula apertura PDF
        const pdfWindow = window.open('', '_blank');
        pdfWindow.document.write(`
            <html>
            <head><title>PDF Tecnico - Porta Scrigno</title></head>
            <body>
                <h1>Disegno Tecnico Porta Scrigno</h1>
                <p>Larghezza porta: ${larghezzaPorta} cm</p>
                <p>Altezza porta: ${altezzaPorta} cm</p>
                <p>Larghezza controtelaio: ${larghezzaControtelaio} cm</p>
                <p>Altezza controtelaio: ${altezzaVano} cm</p>
                <p>Il PDF contiene disegno quotato e dati tecnici per la posa.</p>
            </body>
            </html>
        `);
    });
});