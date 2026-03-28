// Boss Kill Tracker with Analytics Dashboard
class BossTracker {
    constructor() {
        // Load saved data or initialize
        this.loadBossData();
        this.currentSession = {
            boss: null,
            kills: 0,
            startTime: null,
            drops: []
        };
    }

    loadBossData() {
        const saved = localStorage.getItem('bossTrackerData');
        if (saved) {
            this.bossData = JSON.parse(saved);
        } else {
            this.bossData = {
                'Vorkath': {
                    kills: 1337,
                    totalLoot: 4200000000,
                    averageLoot: 125000,
                    sessions: [],
                    drops: {
                        'Vorkath\'s Head': { count: 27, value: 0 },
                        'Dragonbone Necklace': { count: 2, value: 9000000 },
                        'Skeletal Visage': { count: 0, value: 18000000 }
                    }
                },
                'Corporeal Beast': {
                    kills: 500,
                    totalLoot: 1500000000,
                    averageLoot: 300000,
                    sessions: [],
                    drops: {
                        'Elysian Sigil': { count: 0, value: 600000000 },
                        'Arcane Sigil': { count: 1, value: 150000000 },
                        'Spectral Sigil': { count: 0, value: 40000000 },
                        'Spirit Shield': { count: 8, value: 150000 },
                        'Holy Elixir': { count: 3, value: 750000 }
                    }
                },
                'Chambers of Xeric': {
                    kills: 250,
                    totalLoot: 3750000000,
                    averageLoot: 1500000,
                    sessions: [],
                    drops: {
                        'Twisted Bow': { count: 0, value: 1200000000 },
                        'Elder Maul': { count: 1, value: 45000000 },
                        'Dragon Hunter Crossbow': { count: 2, value: 110000000 },
                        'Dragon Claws': { count: 2, value: 65000000 },
                        'Dexterous Prayer Scroll': { count: 3, value: 25000000 },
                        'Arcane Prayer Scroll': { count: 2, value: 3000000 }
                    }
                },
                'Theatre of Blood': {
                    kills: 150,
                    totalLoot: 2250000000,
                    averageLoot: 1500000,
                    sessions: [],
                    drops: {
                        'Scythe of Vitur': { count: 0, value: 600000000 },
                        'Ghrazi Rapier': { count: 2, value: 180000000 },
                        'Sanguinesti Staff': { count: 1, value: 100000000 },
                        'Justiciar Chestguard': { count: 3, value: 15000000 },
                        'Avernic Defender Hilt': { count: 1, value: 80000000 }
                    }
                },
                'General Graardor': {
                    kills: 1000,
                    totalLoot: 381000000,
                    averageLoot: 38100,
                    sessions: [],
                    drops: {
                        'Bandos Chestplate': { count: 3, value: 20000000 },
                        'Bandos Tassets': { count: 2, value: 28000000 },
                        'Bandos Boots': { count: 4, value: 200000 },
                        'Bandos Hilt': { count: 1, value: 8000000 }
                    }
                },
                'Zulrah': {
                    kills: 2000,
                    totalLoot: 2400000000,
                    averageLoot: 120000,
                    sessions: [],
                    drops: {
                        'Tanzanite Fang': { count: 8, value: 3000000 },
                        'Magic Fang': { count: 9, value: 2500000 },
                        'Serpentine Visage': { count: 7, value: 2000000 },
                        'Uncut Onyx': { count: 2, value: 2500000 }
                    }
                }
            };
        }
    }

    saveBossData() {
        localStorage.setItem('bossTrackerData', JSON.stringify(this.bossData));
    }

    startSession(bossName) {
        this.currentSession = {
            boss: bossName,
            kills: 0,
            startTime: Date.now(),
            drops: [],
            loot: []
        };
    }

    addKill(lootValue, drops = []) {
        if (!this.currentSession.boss) return;
        
        this.currentSession.kills++;
        this.currentSession.loot.push(lootValue);
        
        // Update boss data
        const boss = this.bossData[this.currentSession.boss];
        boss.kills++;
        boss.totalLoot += lootValue;
        boss.averageLoot = Math.round(boss.totalLoot / boss.kills);
        
        // Update drops
        drops.forEach(drop => {
            if (boss.drops[drop.name]) {
                boss.drops[drop.name].count++;
            }
            this.currentSession.drops.push(drop);
        });
        
        this.saveBossData();
    }

    endSession() {
        if (!this.currentSession.boss || this.currentSession.kills === 0) return null;
        
        const duration = Date.now() - this.currentSession.startTime;
        const totalLoot = this.currentSession.loot.reduce((sum, val) => sum + val, 0);
        
        const session = {
            timestamp: Date.now(),
            boss: this.currentSession.boss,
            kills: this.currentSession.kills,
            duration: duration,
            totalLoot: totalLoot,
            averageLoot: Math.round(totalLoot / this.currentSession.kills),
            killsPerHour: Math.round((this.currentSession.kills / duration) * 3600000),
            gpPerHour: Math.round((totalLoot / duration) * 3600000),
            drops: this.currentSession.drops
        };
        
        // Save session
        if (!this.bossData[this.currentSession.boss].sessions) {
            this.bossData[this.currentSession.boss].sessions = [];
        }
        this.bossData[this.currentSession.boss].sessions.push(session);
        
        // Keep only last 50 sessions
        if (this.bossData[this.currentSession.boss].sessions.length > 50) {
            this.bossData[this.currentSession.boss].sessions.shift();
        }
        
        this.saveBossData();
        this.currentSession = { boss: null, kills: 0, startTime: null, drops: [] };
        
        return session;
    }

    calculateDryStreak(bossName, itemName) {
        const boss = this.bossData[bossName];
        if (!boss || !boss.drops[itemName]) return null;
        
        const dropData = boss.drops[itemName];
        const killsSinceLast = boss.kills - (dropData.lastKC || 0);
        
        // Get drop rate from collection log data
        const dropRates = {
            'Elysian Sigil': 1/4095,
            'Twisted Bow': 1/1042,
            'Scythe of Vitur': 1/173,
            'Skeletal Visage': 1/5000,
            'Tanzanite Fang': 1/512,
            'Dragon Hunter Crossbow': 1/208
        };
        
        const dropRate = dropRates[itemName] || 1/1000;
        const probability = 1 - Math.pow(1 - dropRate, killsSinceLast);
        
        return {
            killsSinceLast,
            probability,
            expectedKC: Math.round(1 / dropRate),
            isDry: killsSinceLast > (1 / dropRate) * 2
        };
    }

    getAnalytics(bossName) {
        const boss = this.bossData[bossName];
        if (!boss) return null;
        
        const sessions = boss.sessions || [];
        const recentSessions = sessions.slice(-10);
        
        // Calculate trends
        const recentGPH = recentSessions.length > 0 
            ? recentSessions.reduce((sum, s) => sum + s.gpPerHour, 0) / recentSessions.length
            : 0;
        
        const recentKPH = recentSessions.length > 0
            ? recentSessions.reduce((sum, s) => sum + s.killsPerHour, 0) / recentSessions.length
            : 0;
        
        return {
            totalKills: boss.kills,
            totalValue: boss.totalLoot,
            averageLoot: boss.averageLoot,
            recentGPH: Math.round(recentGPH),
            recentKPH: Math.round(recentKPH),
            estimatedTimeToMax: Math.round((8000000000 - boss.totalLoot) / recentGPH),
            sessions: recentSessions,
            drops: boss.drops
        };
    }

    renderTracker() {
        const container = document.getElementById('boss-tracker-content');
        if (!container) return;
        
        let html = `
            <div class="boss-tracker-interface">
                <div class="session-controls">
                    <h3>Session Tracker</h3>
                    <div class="session-inputs">
                        <select id="boss-select">
                            <option value="">Select Boss</option>
                            ${Object.keys(this.bossData).map(boss => 
                                `<option value="${boss}">${boss}</option>`
                            ).join('')}
                        </select>
                        
                        <button class="start-session-btn" onclick="window.bossTracker.startNewSession()">
                            Start Session
                        </button>
                        
                        <div id="active-session" style="display: none;">
                            <h4>Active Session: <span id="session-boss"></span></h4>
                            <p>Kills: <span id="session-kills">0</span></p>
                            <p>Duration: <span id="session-duration">00:00</span></p>
                            
                            <div class="kill-inputs">
                                <input type="number" id="kill-value" placeholder="Loot value">
                                <button onclick="window.bossTracker.recordKill()">Add Kill</button>
                            </div>
                            
                            <button class="end-session-btn" onclick="window.bossTracker.endCurrentSession()">
                                End Session
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="boss-overview">
                    <h3>Boss Overview</h3>
                    <div class="boss-grid">
                        ${Object.entries(this.bossData).map(([name, data]) => `
                            <div class="boss-overview-card" onclick="window.bossTracker.showBossDetails('${name}')">
                                <h4>${name}</h4>
                                <div class="boss-stats-mini">
                                    <div class="mini-stat">
                                        <span class="label">KC</span>
                                        <span class="value">${data.kills.toLocaleString()}</span>
                                    </div>
                                    <div class="mini-stat">
                                        <span class="label">Total</span>
                                        <span class="value">${(data.totalLoot / 1000000).toFixed(1)}M</span>
                                    </div>
                                    <div class="mini-stat">
                                        <span class="label">Avg</span>
                                        <span class="value">${(data.averageLoot / 1000).toFixed(0)}K</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div id="boss-details-view"></div>
                
                <div class="analytics-dashboard">
                    <h3>Analytics Dashboard</h3>
                    <canvas id="boss-chart"></canvas>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        this.updateSessionTimer();
        this.renderChart();
    }

    startNewSession() {
        const bossName = document.getElementById('boss-select').value;
        if (!bossName) {
            alert('Please select a boss first!');
            return;
        }
        
        this.startSession(bossName);
        document.getElementById('active-session').style.display = 'block';
        document.getElementById('session-boss').textContent = bossName;
        document.getElementById('session-kills').textContent = '0';
        
        // Start timer
        this.sessionTimerInterval = setInterval(() => this.updateSessionTimer(), 1000);
    }

    updateSessionTimer() {
        if (!this.currentSession.startTime) return;
        
        const duration = Date.now() - this.currentSession.startTime;
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);
        
        const timerEl = document.getElementById('session-duration');
        if (timerEl) {
            timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    recordKill() {
        const value = parseInt(document.getElementById('kill-value').value) || 0;
        this.addKill(value);
        
        document.getElementById('session-kills').textContent = this.currentSession.kills;
        document.getElementById('kill-value').value = '';
        
        // Update display
        this.renderTracker();
    }

    endCurrentSession() {
        if (this.sessionTimerInterval) {
            clearInterval(this.sessionTimerInterval);
        }
        
        const session = this.endSession();
        if (session) {
            alert(`Session ended!\nKills: ${session.kills}\nTotal: ${session.totalLoot.toLocaleString()} gp\nGP/Hour: ${session.gpPerHour.toLocaleString()}`);
        }
        
        document.getElementById('active-session').style.display = 'none';
        this.renderTracker();
    }

    showBossDetails(bossName) {
        const analytics = this.getAnalytics(bossName);
        const container = document.getElementById('boss-details-view');
        
        let html = `
            <div class="boss-details-panel">
                <h3>${bossName} Details</h3>
                
                <div class="detailed-stats">
                    <div class="stat-card">
                        <h4>Total Kills</h4>
                        <p class="big-number">${analytics.totalKills.toLocaleString()}</p>
                    </div>
                    <div class="stat-card">
                        <h4>Total Value</h4>
                        <p class="big-number">${(analytics.totalValue / 1000000000).toFixed(2)}B</p>
                    </div>
                    <div class="stat-card">
                        <h4>Recent GP/Hr</h4>
                        <p class="big-number">${(analytics.recentGPH / 1000000).toFixed(1)}M</p>
                    </div>
                    <div class="stat-card">
                        <h4>Recent Kills/Hr</h4>
                        <p class="big-number">${analytics.recentKPH}</p>
                    </div>
                </div>
                
                <div class="drops-section">
                    <h4>Notable Drops</h4>
                    <div class="drops-grid">
                        ${Object.entries(analytics.drops).map(([item, data]) => {
                            const dryInfo = this.calculateDryStreak(bossName, item);
                            return `
                                <div class="drop-card">
                                    <h5>${item}</h5>
                                    <p>Count: ${data.count}</p>
                                    <p>Value: ${(data.value / 1000000).toFixed(1)}M</p>
                                    ${dryInfo && data.count === 0 ? `
                                        <p class="dry-info">Dry for ${analytics.totalKills} kills</p>
                                        <p class="dry-probability">${(dryInfo.probability * 100).toFixed(1)}% chance by now</p>
                                    ` : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                
                <div class="sessions-history">
                    <h4>Recent Sessions</h4>
                    <div class="sessions-list">
                        ${analytics.sessions.slice(-5).reverse().map(session => `
                            <div class="session-item">
                                <span>${new Date(session.timestamp).toLocaleDateString()}</span>
                                <span>${session.kills} kills</span>
                                <span>${(session.totalLoot / 1000000).toFixed(1)}M</span>
                                <span>${(session.gpPerHour / 1000000).toFixed(1)}M/hr</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }

    renderChart() {
        const canvas = document.getElementById('boss-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Prepare data for chart
        const bosses = Object.keys(this.bossData);
        const totalValues = bosses.map(boss => this.bossData[boss].totalLoot / 1000000);
        const killCounts = bosses.map(boss => this.bossData[boss].kills);
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: bosses,
                datasets: [
                    {
                        label: 'Total Value (M)',
                        data: totalValues,
                        backgroundColor: 'rgba(251, 191, 36, 0.6)',
                        borderColor: 'rgba(251, 191, 36, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Boss Loot Values'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + 'M';
                            }
                        }
                    }
                }
            }
        });
    }

    init() {
        this.renderTracker();
    }
}

// Initialize boss tracker
window.bossTracker = new BossTracker();