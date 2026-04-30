/**
 * Widget Dólar BCV - Retoma.net
 * Uso: <script src="https://retoma.net/widget-dolar.js"></script>
 *      <div id="retoma-dolar-widget"></div>
 */

(function() {
    // Configuración
    const API_URL = 'https://retoma.net/api/dolar-proxy.php';
    const WIDGET_ID = 'retoma-dolar-widget';
    
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }
    
    function initWidget() {
        const container = document.getElementById(WIDGET_ID);
        if (!container) return;
        
        // Estilos del widget
        const style = document.createElement('style');
        style.textContent = `
            .retoma-widget {
                font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #1e40af, #1e3a8a);
                border-radius: 12px;
                padding: 16px;
                color: white;
                text-align: center;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                max-width: 280px;
                margin: 0 auto;
            }
            .retoma-widget-title {
                font-size: 14px;
                opacity: 0.8;
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .retoma-widget-rate {
                font-size: 28px;
                font-weight: 700;
                margin: 8px 0;
            }
            .retoma-widget-rate small {
                font-size: 14px;
                font-weight: normal;
                opacity: 0.8;
            }
            .retoma-widget-date {
                font-size: 11px;
                opacity: 0.7;
                margin-bottom: 12px;
            }
            .retoma-widget-variation {
                font-size: 12px;
                padding: 4px 8px;
                border-radius: 20px;
                display: inline-block;
                margin-bottom: 12px;
            }
            .retoma-widget-variation.positive {
                background: rgba(16, 185, 129, 0.2);
                color: #4ade80;
            }
            .retoma-widget-variation.negative {
                background: rgba(239, 68, 68, 0.2);
                color: #f87171;
            }
            .retoma-widget-link {
                display: block;
                background: rgba(255,255,255,0.15);
                color: white;
                text-decoration: none;
                padding: 8px 12px;
                border-radius: 8px;
                font-size: 12px;
                font-weight: 600;
                transition: background 0.3s ease;
                margin-top: 8px;
            }
            .retoma-widget-link:hover {
                background: rgba(255,255,255,0.25);
                text-decoration: none;
            }
            .retoma-widget-footer {
                font-size: 9px;
                opacity: 0.5;
                margin-top: 10px;
            }
            .retoma-widget-loading {
                text-align: center;
                padding: 20px;
                color: white;
                font-size: 12px;
            }
            .retoma-widget-loading::before {
                content: '';
                display: inline-block;
                width: 12px;
                height: 12px;
                margin-right: 8px;
                border: 2px solid rgba(255,255,255,0.3);
                border-top-color: white;
                border-radius: 50%;
                animation: retoma-spin 0.8s linear infinite;
            }
            @keyframes retoma-spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        // Mostrar loading
        container.innerHTML = `
            <div class="retoma-widget">
                <div class="retoma-widget-loading">Cargando dólar BCV...</div>
            </div>
        `;
        
        // Cargar datos
        fetch(API_URL + '?t=' + Date.now())
            .then(res => res.json())
            .then(data => {
                if (data && data.data && data.data.current) {
                    const rate = data.data.current.usd;
                    const date = data.data.current.date;
                    const change = data.data.change;
                    
                    let variationHtml = '';
                    if (change && change.usd !== null) {
                        const isPositive = change.usd >= 0;
                        variationHtml = `<div class="retoma-widget-variation ${isPositive ? 'positive' : 'negative'}">
                            ${isPositive ? '▲' : '▼'} ${Math.abs(change.usd).toFixed(2)} Bs. (${Math.abs(change.percent).toFixed(2)}%)
                        </div>`;
                    }
                    
                    // Formatear fecha
                    const [year, month, day] = date.split('-');
                    const fechaFormateada = `${day}/${month}/${year}`;
                    
                    container.innerHTML = `
                        <div class="retoma-widget">
                            <div class="retoma-widget-title">💵 Dólar BCV Oficial</div>
                            <div class="retoma-widget-rate">
                                1 USD = <strong>${rate.toFixed(2)}</strong> <small>Bs.</small>
                            </div>
                            <div class="retoma-widget-date">Fecha: ${fechaFormateada}</div>
                            ${variationHtml}
                            <a href="https://retoma.net/dolar-bcv.php" target="_blank" class="retoma-widget-link">
                                📊 Ver histórico completo →
                            </a>
                            <div class="retoma-widget-footer">Fuente: BCV | Retoma.net</div>
                        </div>
                    `;
                } else {
                    container.innerHTML = `
                        <div class="retoma-widget">
                            <div class="retoma-widget-title">💵 Dólar BCV</div>
                            <div class="retoma-widget-rate">Temporalmente no disponible</div>
                            <a href="https://retoma.net/dolar-bcv.php" target="_blank" class="retoma-widget-link">
                                Visitar Retoma.net →
                            </a>
                        </div>
                    `;
                }
            })
            .catch(error => {
                container.innerHTML = `
                    <div class="retoma-widget">
                        <div class="retoma-widget-title">💵 Dólar BCV</div>
                        <div class="retoma-widget-rate">Error al cargar</div>
                        <a href="https://retoma.net/dolar-bcv.php" target="_blank" class="retoma-widget-link">
                            Ver tasa actual en Retoma.net →
                        </a>
                    </div>
                `;
            });
    }
})();
