// GE Market Analyzer with Arbitrage Detection
class GEAnalyzer {
    constructor() {
        // Mock GE price data (in reality would fetch from API)
        this.priceData = {
            'Twisted bow': {
                id: 20997,
                currentPrice: 1189532000,
                buyPrice: 1195000000,
                sellPrice: 1184000000,
                volume: 45,
                margin: 11000000,
                roi: 0.93,
                trend: 'rising',
                history: this.generatePriceHistory(1189532000, 30)
            },
            'Elysian spirit shield': {
                id: 12817,
                currentPrice: 612450000,
                buyPrice: 615000000,
                sellPrice: 610000000,
                volume: 23,
                margin: 5000000,
                roi: 0.82,
                trend: 'stable',
                history: this.generatePriceHistory(612450000, 30)
            },
            'Dragon claws': {
                id: 13652,
                currentPrice: 64250000,
                buyPrice: 64500000,
                sellPrice: 64000000,
                volume: 312,
                margin: 500000,
                roi: 0.78,
                trend: 'falling',
                history: this.generatePriceHistory(64250000, 30)
            },
            'Dwarf cannon set': {
                id: 6,
                currentPrice: 750000,
                buyPrice: 755000,
                sellPrice: 745000,
                volume: 8945,
                margin: 10000,
                roi: 1.33,
                trend: 'rising',
                history: this.generatePriceHistory(750000, 30)
            },
            'Dragon bones': {
                id: 536,
                currentPrice: 2450,
                buyPrice: 2465,
                sellPrice: 2435,
                volume: 854320,
                margin: 30,
                roi: 1.23,
                trend: 'stable',
                history: this.generatePriceHistory(2450, 30)
            },
            'Ranarr seed': {
                id: 5295,
                currentPrice: 45600,
                buyPrice: 46000,
                sellPrice: 45200,
                volume: 124500,
                margin: 800,
                roi: 1.77,
                trend: 'rising',
                history: this.generatePriceHistory(45600, 30)
            },
            'Saradomin brew(4)': {
                id: 6685,
                currentPrice: 8950,
                buyPrice: 9000,
                sellPrice: 8900,
                volume: 567000,
                margin: 100,
                roi: 1.12,
                trend: 'stable',
                history: this.generatePriceHistory(8950, 30)
            },
            'Super restore(4)': {
                id: 3024,
                currentPrice: 11200,
                buyPrice: 11300,
                sellPrice: 11100,
                volume: 445000,
                margin: 200,
                roi: 1.80,
                trend: 'rising',
                history: this.generatePriceHistory(11200, 30)
            },
            'Blood rune': {
                id: 565,
                currentPrice: 385,
                buyPrice: 388,
                sellPrice: 382,
                volume: 12450000,
                margin: 6,
                roi: 1.57,
                trend: 'stable',
                history: this.generatePriceHistory(385, 30)
            },
            'Nature rune': {
                id: 561,
                currentPrice: 245,
                buyPrice: 247,
                sellPrice: 243,
                volume: 18900000,
                margin: 4,
                roi: 1.65,
                trend: 'falling',
                history: this.generatePriceHistory(245, 30)
            }
        };
        
        this.watchlist = ['Twisted bow', 'Dragon claws', 'Ranarr seed'];
        this.alerts = [];
        this.flipHistory = [];
    }

    generatePriceHistory(basePrice, days) {
        const history = [];
        let price = basePrice;
        
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            // Add some realistic variation
            const variation = (Math.random() - 0.5) * 0.02; // ±2% daily variation
            price = Math.round(price * (1 + variation));
            
            history.push({
                date: date,
                price: price,
                volume: Math.floor(Math.random() * 100000) + 50000
            });
        }
        
        return history;
    }

    calculateArbitrageOpportunities() {
        const opportunities = [];
        
        Object.entries(this.priceData).forEach(([item, data]) => {
            const profitMargin = ((data.margin / data.buyPrice) * 100).toFixed(2);
            const dailyVolume = data.volume;
            const potentialProfit = data.margin * Math.min(dailyVolume / 10, 100); // Conservative estimate
            
            opportunities.push({
                item,
                margin: data.margin,
                marginPercent: profitMargin,
                roi: data.roi,
                buyPrice: data.buyPrice,
                sellPrice: data.sellPrice,
                volume: data.volume,
                potentialProfit,
                risk: this.calculateRisk(data),
                score: this.calculateOpportunityScore(data)
            });
        });
        
        return opportunities.sort((a, b) => b.score - a.score);
    }

    calculateRisk(data) {
        // Risk based on volume, margin, and volatility
        const volumeRisk = data.volume < 100 ? 'high' : data.volume < 1000 ? 'medium' : 'low';
        const marginRisk = data.roi < 1 ? 'high' : data.roi < 2 ? 'medium' : 'low';
        
        if (volumeRisk === 'high' || marginRisk === 'high') return 'high';
        if (volumeRisk === 'medium' || marginRisk === 'medium') return 'medium';
        return 'low';
    }

    calculateOpportunityScore(data) {
        // Score based on ROI, volume, and margin
        const roiScore = data.roi * 10;
        const volumeScore = Math.min(data.volume / 100, 10);
        const marginScore = Math.min(data.margin / 1000000, 10);
        
        return roiScore + volumeScore + marginScore;
    }

    checkPriceAlerts() {
        this.alerts = [];
        
        this.watchlist.forEach(item => {
            const data = this.priceData[item];
            if (!data) return;
            
            const avgPrice = data.history.slice(-7).reduce((sum, h) => sum + h.price, 0) / 7;
            const priceChange = ((data.currentPrice - avgPrice) / avgPrice) * 100;
            
            if (Math.abs(priceChange) > 5) {
                this.alerts.push({
                    item,
                    type: priceChange > 0 ? 'price-rise' : 'price-drop',
                    change: priceChange,
                    message: `${item} has ${priceChange > 0 ? 'risen' : 'dropped'} ${Math.abs(priceChange).toFixed(1)}% from 7-day average`
                });
            }
            
            if (data.margin > 1000000) {
                this.alerts.push({
                    item,
                    type: 'high-margin',
                    margin: data.margin,
                    message: `${item} has exceptional margin of ${data.margin.toLocaleString()} gp`
                });
            }
        });
        
        return this.alerts;
    }

    addFlipToHistory(flip) {
        this.flipHistory.unshift({
            ...flip,
            timestamp: Date.now(),
            profit: flip.quantity * (flip.sellPrice - flip.buyPrice)
        });
        
        // Keep last 50 flips
        if (this.flipHistory.length > 50) {
            this.flipHistory = this.flipHistory.slice(0, 50);
        }
        
        localStorage.setItem('flipHistory', JSON.stringify(this.flipHistory));
    }

    renderAnalyzer() {
        const container = document.getElementById('ge-analyzer-content');
        if (!container) return;
        
        const opportunities = this.calculateArbitrageOpportunities();
        const alerts = this.checkPriceAlerts();
        
        let html = `
            <div class="ge-analyzer">
                <!-- Market Alerts -->
                ${alerts.length > 0 ? `
                    <div class="market-alerts">
                        <h3>🚨 Market Alerts</h3>
                        <div class="alerts-list">
                            ${alerts.map(alert => `
                                <div class="alert-item ${alert.type}">
                                    <span class="alert-icon">${alert.type === 'price-rise' ? '📈' : 
                                        alert.type === 'price-drop' ? '📉' : '💰'}</span>
                                    <span class="alert-message">${alert.message}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <!-- Top Arbitrage Opportunities -->
                <div class="arbitrage-opportunities">
                    <h3>Top Arbitrage Opportunities</h3>
                    <div class="opportunities-grid">
                        ${opportunities.slice(0, 6).map(opp => `
                            <div class="opportunity-card risk-${opp.risk}">
                                <h4>${opp.item}</h4>
                                <div class="opp-stats">
                                    <div class="stat">
                                        <span class="label">Margin</span>
                                        <span class="value">${opp.margin.toLocaleString()} gp</span>
                                    </div>
                                    <div class="stat">
                                        <span class="label">ROI</span>
                                        <span class="value">${opp.marginPercent}%</span>
                                    </div>
                                    <div class="stat">
                                        <span class="label">Volume</span>
                                        <span class="value">${opp.volume.toLocaleString()}</span>
                                    </div>
                                    <div class="stat">
                                        <span class="label">Risk</span>
                                        <span class="value risk-badge">${opp.risk}</span>
                                    </div>
                                </div>
                                <div class="prices">
                                    <span class="buy-price">Buy: ${opp.buyPrice.toLocaleString()}</span>
                                    <span class="sell-price">Sell: ${opp.sellPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Watchlist -->
                <div class="watchlist-section">
                    <h3>Watchlist</h3>
                    <div class="watchlist-controls">
                        <input type="text" id="add-watchlist" placeholder="Add item to watchlist">
                        <button onclick="window.geAnalyzer.addToWatchlist()">Add</button>
                    </div>
                    <div class="watchlist-items">
                        ${this.watchlist.map(item => {
                            const data = this.priceData[item];
                            return data ? `
                                <div class="watchlist-item">
                                    <div class="item-header">
                                        <h4>${item}</h4>
                                        <span class="trend trend-${data.trend}">${data.trend}</span>
                                    </div>
                                    <div class="item-price">
                                        <span class="current">${data.currentPrice.toLocaleString()} gp</span>
                                        <canvas id="chart-${item.replace(/ /g, '-')}" class="mini-chart"></canvas>
                                    </div>
                                    <button class="remove-btn" onclick="window.geAnalyzer.removeFromWatchlist('${item}')">×</button>
                                </div>
                            ` : '';
                        }).join('')}
                    </div>
                </div>
                
                <!-- Flip Tracker -->
                <div class="flip-tracker">
                    <h3>Flip Tracker</h3>
                    <div class="flip-form">
                        <input type="text" id="flip-item" placeholder="Item name">
                        <input type="number" id="flip-buy" placeholder="Buy price">
                        <input type="number" id="flip-sell" placeholder="Sell price">
                        <input type="number" id="flip-quantity" placeholder="Quantity">
                        <button onclick="window.geAnalyzer.addFlip()">Add Flip</button>
                    </div>
                    
                    <div class="flip-stats">
                        <div class="stat-box">
                            <h4>Total Profit</h4>
                            <p>${this.calculateTotalProfit().toLocaleString()} gp</p>
                        </div>
                        <div class="stat-box">
                            <h4>Today's Profit</h4>
                            <p>${this.calculateTodayProfit().toLocaleString()} gp</p>
                        </div>
                        <div class="stat-box">
                            <h4>Success Rate</h4>
                            <p>${this.calculateSuccessRate()}%</p>
                        </div>
                    </div>
                    
                    <div class="flip-history">
                        <h4>Recent Flips</h4>
                        ${this.flipHistory.slice(0, 10).map(flip => `
                            <div class="flip-entry ${flip.profit > 0 ? 'profit' : 'loss'}">
                                <span class="flip-item">${flip.item}</span>
                                <span class="flip-quantity">${flip.quantity}x</span>
                                <span class="flip-profit">${flip.profit > 0 ? '+' : ''}${flip.profit.toLocaleString()}</span>
                                <span class="flip-time">${new Date(flip.timestamp).toLocaleTimeString()}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        // Render mini charts
        setTimeout(() => {
            this.watchlist.forEach(item => {
                this.renderMiniChart(item);
            });
        }, 100);
    }

    renderMiniChart(item) {
        const canvas = document.getElementById(`chart-${item.replace(/ /g, '-')}`);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = this.priceData[item];
        if (!data) return;
        
        const prices = data.history.slice(-7).map(h => h.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const range = max - min;
        
        canvas.width = 100;
        canvas.height = 30;
        
        ctx.strokeStyle = data.trend === 'rising' ? '#4ade80' : 
                         data.trend === 'falling' ? '#ef4444' : '#fbbf24';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        prices.forEach((price, i) => {
            const x = (i / (prices.length - 1)) * canvas.width;
            const y = canvas.height - ((price - min) / range) * canvas.height;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
    }

    addToWatchlist() {
        const input = document.getElementById('add-watchlist');
        const item = input.value.trim();
        
        if (item && !this.watchlist.includes(item)) {
            this.watchlist.push(item);
            input.value = '';
            this.renderAnalyzer();
        }
    }

    removeFromWatchlist(item) {
        this.watchlist = this.watchlist.filter(i => i !== item);
        this.renderAnalyzer();
    }

    addFlip() {
        const item = document.getElementById('flip-item').value;
        const buyPrice = parseInt(document.getElementById('flip-buy').value) || 0;
        const sellPrice = parseInt(document.getElementById('flip-sell').value) || 0;
        const quantity = parseInt(document.getElementById('flip-quantity').value) || 0;
        
        if (item && buyPrice && sellPrice && quantity) {
            this.addFlipToHistory({ item, buyPrice, sellPrice, quantity });
            
            // Clear form
            document.getElementById('flip-item').value = '';
            document.getElementById('flip-buy').value = '';
            document.getElementById('flip-sell').value = '';
            document.getElementById('flip-quantity').value = '';
            
            this.renderAnalyzer();
        }
    }

    calculateTotalProfit() {
        return this.flipHistory.reduce((sum, flip) => sum + flip.profit, 0);
    }

    calculateTodayProfit() {
        const today = new Date().setHours(0, 0, 0, 0);
        return this.flipHistory
            .filter(flip => flip.timestamp >= today)
            .reduce((sum, flip) => sum + flip.profit, 0);
    }

    calculateSuccessRate() {
        if (this.flipHistory.length === 0) return 0;
        const successful = this.flipHistory.filter(flip => flip.profit > 0).length;
        return Math.round((successful / this.flipHistory.length) * 100);
    }

    init() {
        // Load saved data
        const savedHistory = localStorage.getItem('flipHistory');
        if (savedHistory) {
            this.flipHistory = JSON.parse(savedHistory);
        }
        
        this.renderAnalyzer();
    }
}

// Initialize GE Analyzer
window.geAnalyzer = new GEAnalyzer();