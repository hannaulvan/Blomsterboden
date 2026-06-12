/**
 * script.js - Skript för spårning av användarbeteende och kursanalys.
 */

function trackCTA(elementName) {
    console.log("📊 [EVENT SPÅRAT]: Klick på CTA -> " + elementName);
    if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
            'event': 'cta_click',
            'cta_location': elementName
        });
    }
}

function trackConversion(conversionType, itemName, value) {
    console.log(`🎉 [KONVERTERING SKICKAD]: Typ: ${conversionType} | Namn: ${itemName} | Värde: ${value}kr`);
    
    localStorage.setItem('last_conversion', JSON.stringify({
        type: conversionType,
        item: itemName,
        value: value,
        timestamp: new Date().getTime()
    }));

    return true;
}

document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname.includes('thank-you.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const debugQueryEl = document.getElementById('debug-query');
        const debugTypeEl = document.getElementById('debug-type');
        const titleEl = document.getElementById('thank-you-title');
        const messageEl = document.getElementById('thank-you-message');
        
        if (debugQueryEl) {
            debugQueryEl.textContent = window.location.search || "?(Inga URL-parametrar skickades - använd formulären)";
        }

        const lastConversionStr = localStorage.getItem('last_conversion');
        
        if (lastConversionStr) {
            const conversion = JSON.parse(lastConversionStr);
            if (new Date().getTime() - conversion.timestamp < 10000) {
                if (debugTypeEl) {
                    debugTypeEl.textContent = `${conversion.type} (${conversion.item} - värde ${conversion.value} kr)`;
                }
                if (conversion.type === 'Köp') {
                    titleEl.textContent = "Tack för din beställning!";
                    messageEl.textContent = `Ditt simulerade köp av "${conversion.item}" för ${conversion.value} kr har registrerats i datalagret.`;
                } else if (conversion.type === 'Lead') {
                    titleEl.textContent = "Välkommen till kundklubben!";
                    messageEl.textContent = "Din e-postadress har registrerats för framtida nyhetsbrev.";
                } else if (conversion.type === 'Kontaktforfragan') {
                    titleEl.textContent = "Meddelande skickat!";
                    messageEl.textContent = "Tack för din förfrågan. Vi hör av oss inom kort.";
                }
            } else {
                if (debugTypeEl) debugTypeEl.textContent = "Direktvisning (Ingen aktiv konvertering just nu)";
            }
        } else {
            if (debugTypeEl) debugTypeEl.textContent = "Direktvisning (Ingen data funnen)";
        }
    }
});