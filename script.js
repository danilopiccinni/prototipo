// ======================================================
// SCRIPT PER DISEGNO PORTA E CONTROTELAIO CON QUOTE SVG
// ======================================================

document.addEventListener('DOMContentLoaded', function() {

    // =========================
    // SEZIONE INPUT UTENTE
    // =========================
    // Recuperiamo gli input e i pulsanti dal DOM
    const larghezzaInput = document.getElementById('larghezza'); // larghezza porta in cm
    const altezzaInput = document.getElementById('altezza');     // altezza porta in cm
    const aggiornaBtn = document.getElementById('aggiorna');    // pulsante per aggiornare disegno
    const scaricaBtn = document.getElementById('scarica-pdf');  // pulsante per scaricare PDF (non usato qui)

    // =========================
    // SEZIONE QUOTE TESTO SVG
    // =========================
    // Elementi SVG per mostrare le misure sul disegno
    const quotaLarghezzaPorta = document.getElementById('quota-larghezza-porta');
    const quotaAltezzaPorta = document.getElementById('quota-altezza-porta');
    const quotaLarghezzaVano = document.getElementById('quota-larghezza-vano');
    const quotaAltezzaVano = document.getElementById('quota-altezza-vano');

    // Elementi HTML per riepilogo numerico delle misure
    const valLarghezzaPorta = document.getElementById('val-larghezza-porta');
    const valAltezzaPorta = document.getElementById('val-altezza-porta');
    const valLarghezzaVano = document.getElementById('val-larghezza-vano');
    const valAltezzaVano = document.getElementById('val-altezza-vano');

    // =========================
    // SEZIONE VARIABILI INIZIALI
    // =========================
    let larghezzaPorta = 200;   // cm
    let altezzaPorta = 160;     // cm
    let larghezzaVano = 500;    // cm (larghezza totale del vano con muro)
    let altezzaVano = 300;      // cm (altezza totale del vano con muro)
    let larghezzaControtelaio = 0; // cm, calcolata in base alla porta

    // =========================
    // SEZIONE ELEMENTI SVG PRINCIPALI
    // =========================
    const svg = document.getElementById('disegno');       // elemento SVG contenitore
    const pavimento = document.getElementById('pavimento'); // linea pavimento
    const muro = document.getElementById('muro');         // rettangolo muro
    const controtelaio = document.getElementById('controtelaio'); // rettangolo controtelaio
    const porta = document.getElementById('porta');       // porta aperta
    const portaChiusa = document.getElementById('porta-chiusa'); // porta chiusa
    const binario = document.getElementById('binario');   // binario porta scorrevole

    // =========================
    // SEZIONE LINEE QUOTE
    // =========================
    // Linee blu e tick marks per le quote
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

    // =========================
    // SEZIONE COSTANTI DI DISEGNO
    // =========================
    const scale = 2;                  // scala: 1 cm = 2 px
    const margine = 50;               // margine SVG laterale
    const muroLarghezza = 25;         // larghezza muro in px (tipo mattone)
    const pavimentoY = 350;           // coordinata Y pavimento
    const margineSopraPorta = 20;     // spazio sopra la porta per il binario
    const extraMuroLateral = 150;     // extra spazio muro laterale per "più parete"
    const tickSize = 5;               // dimensione dei tick delle quote

    // =========================
    // FUNZIONE PRINCIPALE DI AGGIORNAMENTO
    // =========================
    function aggiornaConfigurazione() {
        // =========================
        // 1. LEGGIAMO INPUT UTENTE
        // =========================
        const larg = parseFloat(larghezzaInput.value) || 0;
        const alt = parseFloat(altezzaInput.value) || 0;

        if (larg > 0 && alt > 0) {

            larghezzaPorta = larg;
            altezzaPorta = alt;

            // =========================
            // 2. CALCOLO DIMENSIONI ELEMENTI IN PIXEL
            // =========================
            const portaWidthPx = larghezzaPorta * scale;
            const portaHeightPx = altezzaPorta * scale;

            // Controtelaio leggermente più largo della porta
            const controtelaioWidthPx = portaWidthPx * 2;
            const controtelaioHeightPx = portaHeightPx + margineSopraPorta;

            // Muro totale: controtelaio + margine muro + extra lato
            const muroWidthPx = controtelaioWidthPx + 2 * muroLarghezza + 2 * extraMuroLateral;
            const muroHeightPx = controtelaioHeightPx + muroLarghezza;

            // Salviamo valori numerici da visualizzare
            larghezzaControtelaio = controtelaioWidthPx / scale;
            larghezzaVano = muroWidthPx / scale;
            altezzaVano = muroHeightPx / scale;

            // =========================
            // 3. POSIZIONAMENTO ELEMENTI PRINCIPALI
            // =========================

            // --- Muro ---
            const muroX = margine;
            const muroY = pavimentoY - muroHeightPx;
            muro.setAttribute('x', muroX);
            muro.setAttribute('y', muroY);
            muro.setAttribute('width', muroWidthPx);
            muro.setAttribute('height', muroHeightPx);

            // --- Controtelaio ---
            const controtelaioX = muroX + muroLarghezza + extraMuroLateral;
            const controtelaioY = pavimentoY - controtelaioHeightPx;
            controtelaio.setAttribute('x', controtelaioX);
            controtelaio.setAttribute('y', controtelaioY);
            controtelaio.setAttribute('width', controtelaioWidthPx);
            controtelaio.setAttribute('height', controtelaioHeightPx);

            // --- Porta aperta ---
            const portaX = controtelaioX + 10; // piccolo offset interno
            const portaY = pavimentoY - portaHeightPx;
            porta.setAttribute('x', portaX);
            porta.setAttribute('y', portaY);
            porta.setAttribute('width', portaWidthPx);
            porta.setAttribute('height', portaHeightPx);

            // --- Porta chiusa ---
            const portaChiusaX = controtelaioX + controtelaioWidthPx - portaWidthPx - 10;
            portaChiusa.setAttribute('x', portaChiusaX);
            portaChiusa.setAttribute('y', portaY);
            portaChiusa.setAttribute('width', portaWidthPx);
            portaChiusa.setAttribute('height', portaHeightPx);

            // --- Binario ---
            const binarioY = portaY - margineSopraPorta;
            binario.setAttribute('x1', controtelaioX);
            binario.setAttribute('x2', controtelaioX + controtelaioWidthPx);
            binario.setAttribute('y1', binarioY);
            binario.setAttribute('y2', binarioY);

            // --- Pavimento ---
            pavimento.setAttribute('x1', 0);
            pavimento.setAttribute('y1', pavimentoY);
            pavimento.setAttribute('x2', muroX + muroWidthPx + margine);
            pavimento.setAttribute('y2', pavimentoY);

            // =========================
            // 4. QUOTE DINAMICHE (LINEE E TESTO)
            // =========================

            // --- Larghezza porta (in basso) ---
            const yQuotaLp = portaY + portaHeightPx + 20;
            lineaLarghezzaPorta.setAttribute('x1', portaX);
            lineaLarghezzaPorta.setAttribute('x2', portaX + portaWidthPx);
            lineaLarghezzaPorta.setAttribute('y1', yQuotaLp);
            lineaLarghezzaPorta.setAttribute('y2', yQuotaLp);
            tickLp1.setAttribute('x1', portaX);
            tickLp1.setAttribute('x2', portaX);
            tickLp1.setAttribute('y1', yQuotaLp - tickSize);
            tickLp1.setAttribute('y2', yQuotaLp + tickSize);
            tickLp2.setAttribute('x1', portaX + portaWidthPx);
            tickLp2.setAttribute('x2', portaX + portaWidthPx);
            tickLp2.setAttribute('y1', yQuotaLp - tickSize);
            tickLp2.setAttribute('y2', yQuotaLp + tickSize);
            quotaLarghezzaPorta.setAttribute('x', portaX + portaWidthPx / 2);
            quotaLarghezzaPorta.setAttribute('y', yQuotaLp - 5);
            quotaLarghezzaPorta.textContent = larghezzaPorta + ' cm';

            // --- Altezza porta (a lato) ---
            const xQuotaAp = portaX + portaWidthPx + 20;
            lineaAltezzaPorta.setAttribute('x1', xQuotaAp);
            lineaAltezzaPorta.setAttribute('x2', xQuotaAp);
            lineaAltezzaPorta.setAttribute('y1', portaY);
            lineaAltezzaPorta.setAttribute('y2', portaY + portaHeightPx);
            tickAp1.setAttribute('x1', xQuotaAp - tickSize);
            tickAp1.setAttribute('x2', xQuotaAp + tickSize);
            tickAp1.setAttribute('y1', portaY);
            tickAp1.setAttribute('y2', portaY);
            tickAp2.setAttribute('x1', xQuotaAp - tickSize);
            tickAp2.setAttribute('x2', xQuotaAp + tickSize);
            tickAp2.setAttribute('y1', portaY + portaHeightPx);
            tickAp2.setAttribute('y2', portaY + portaHeightPx);
            quotaAltezzaPorta.setAttribute('x', xQuotaAp + 15);
            quotaAltezzaPorta.setAttribute('y', portaY + portaHeightPx / 2);
            quotaAltezzaPorta.setAttribute('transform', `rotate(90 ${xQuotaAp + 15} ${portaY + portaHeightPx / 2})`);
            quotaAltezzaPorta.textContent = altezzaPorta + ' cm';

            // --- Larghezza controtelaio (in alto) ---
            const yQuotaLv = controtelaioY - 10;
            lineaLarghezzaVano.setAttribute('x1', controtelaioX);
            lineaLarghezzaVano.setAttribute('x2', controtelaioX + controtelaioWidthPx);
            lineaLarghezzaVano.setAttribute('y1', yQuotaLv);
            lineaLarghezzaVano.setAttribute('y2', yQuotaLv);
            tickLv1.setAttribute('x1', controtelaioX);
            tickLv1.setAttribute('x2', controtelaioX);
            tickLv1.setAttribute('y1', yQuotaLv - tickSize);
            tickLv1.setAttribute('y2', yQuotaLv + tickSize);
            tickLv2.setAttribute('x1', controtelaioX + controtelaioWidthPx);
            tickLv2.setAttribute('x2', controtelaioX + controtelaioWidthPx);
            tickLv2.setAttribute('y1', yQuotaLv - tickSize);
            tickLv2.setAttribute('y2', yQuotaLv + tickSize);
            quotaLarghezzaVano.setAttribute('x', controtelaioX + controtelaioWidthPx / 2);
            quotaLarghezzaVano.setAttribute('y', yQuotaLv - 5);
            quotaLarghezzaVano.textContent = larghezzaControtelaio + ' cm';

            // --- Altezza controtelaio (a lato) ---
            const xQuotaAv = controtelaioX + controtelaioWidthPx + 20;
            lineaAltezzaVano.setAttribute('x1', xQuotaAv);
            lineaAltezzaVano.setAttribute('x2', xQuotaAv);
            lineaAltezzaVano.setAttribute('y1', controtelaioY);
            lineaAltezzaVano.setAttribute('y2', controtelaioY + controtelaioHeightPx);
            tickAv1.setAttribute('x1', xQuotaAv - tickSize);
            tickAv1.setAttribute('x2', xQuotaAv + tickSize);
            tickAv1.setAttribute('y1', controtelaioY);
            tickAv1.setAttribute('y2', controtelaioY);
            tickAv2.setAttribute('x1', xQuotaAv - tickSize);
            tickAv2.setAttribute('x2', xQuotaAv + tickSize);
            tickAv2.setAttribute('y1', controtelaioY + controtelaioHeightPx);
            tickAv2.setAttribute('y2', controtelaioY + controtelaioHeightPx);
            quotaAltezzaVano.setAttribute('x', xQuotaAv + 15);
            quotaAltezzaVano.setAttribute('y', controtelaioY + controtelaioHeightPx / 2);
            quotaAltezzaVano.setAttribute('transform', `rotate(90 ${xQuotaAv + 15} ${controtelaioY + controtelaioHeightPx / 2})`);
            quotaAltezzaVano.textContent = altezzaVano + ' cm';

            // =========================
            // 5. AGGIORNAMENTO RIEPILOGO NUMERICO
            // =========================
            valLarghezzaPorta.textContent = larghezzaPorta;
            valAltezzaPorta.textContent = altezzaPorta;
            valLarghezzaVano.textContent = larghezzaControtelaio;
            valAltezzaVano.textContent = altezzaVano;

            // =========================
            // 6. AGGIUSTAMENTO VIEWBOX SVG DINAMICO
            // =========================
            const totalWidth = muroX + muroWidthPx + margine;
            const minY = Math.min(muroY, binarioY - 20);
            const totalHeight = pavimentoY + 50 - minY;
            svg.setAttribute('viewBox', `0 ${minY} ${totalWidth} ${totalHeight}`);
        }
    }

    // =========================
    // EVENT LISTENERS
    // =========================
    aggiornaBtn.addEventListener('click', aggiornaConfigurazione);
    larghezzaInput.addEventListener('input', aggiornaConfigurazione);
    altezzaInput.addEventListener('input', aggiornaConfigurazione);

    // =========================
    // AVVIO INIZIALE
    // =========================
    aggiornaConfigurazione();
});
