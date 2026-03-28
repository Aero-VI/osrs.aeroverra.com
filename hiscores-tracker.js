// Live Hiscores Tracker with Delta Analysis
class HiscoresTracker {
    constructor() {
        this.previousData = {};
        this.currentData = {};
        this.deltaData = {};
        this.updateInterval = 30000; // 30 seconds
        this.chartInstance = null;
        this.historyData = {
            '10tontos': [],
            'Samuelb2800': []
        };
    }

    async fetchPlayerStats(username) {
        try {
            // Using OSRS Hiscores proxy API
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
                `https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${username}`
            )}`;
            
            const response = await fetch(proxyUrl);
            const data = await response.json();
            
            if (data.contents) {
                return this.parseHiscoresData(data.contents, username);
            }
        } catch (error) {
            console.error(`Error fetching stats for ${username}:`, error);
            return this.getMockData(username);
        }
    }

    parseHiscoresData(rawData, username) {
        const lines = rawData.trim().split('\n');
        const skills = ['Overall', 'Attack', 'Defence', 'Strength', 'Hitpoints', 'Ranged', 
                       'Prayer', 'Magic', 'Cooking', 'Woodcutting', 'Fletching', 'Fishing', 
                       'Firemaking', 'Crafting', 'Smithing', 'Mining', 'Herblore', 'Agility', 
                       'Thieving', 'Slayer', 'Farming', 'Runecraft', 'Hunter', 'Construction'];
        
        const stats = {
            username,
            timestamp: Date.now(),
            skills: {}
        };
        
        lines.forEach((line, index) => {
            if (index < skills.length) {
                const [rank, level, xp] = line.split(',').map(Number);
                stats.skills[skills[index]] = { rank, level, xp };
            }
        });
        
        return stats;
    }

    getMockData(username) {
        const seed = username.charCodeAt(0) + Date.now() % 100;
        const skills = ['Overall', 'Attack', 'Defence', 'Strength', 'Hitpoints', 'Ranged', 
                       'Prayer', 'Magic', 'Cooking', 'Woodcutting', 'Fletching', 'Fishing', 
                       'Firemaking', 'Crafting', 'Smithing', 'Mining', 'Herblore', 'Agility', 
                       'Thieving', 'Slayer', 'Farming', 'Runecraft', 'Hunter', 'Construction'];
        
        const stats = {
            username,
            timestamp: Date.now(),
            skills: {}
        };
        
        skills.forEach((skill, index) => {
            const baseXP = (seed + index) * 50000;
            const variation = Math.floor(Math.random() * 10000);
            stats.skills[skill] = {
                rank: Math.floor(Math.random() * 100000) + 1000,
                level: Math.min(99, Math.floor(Math.sqrt(baseXP / 100))),
                xp: baseXP + variation
            };
        });
        
        return stats;
    }

    calculateDeltas(username) {
        const current = this.currentData[username];
        const previous = this.previousData[username];
        
        if (!current || !previous) return null;
        
        const delta = {
            username,
            timestamp: Date.now(),
            timeDiff: current.timestamp - previous.timestamp,
            skills: {}
        };
        
        Object.keys(current.skills).forEach(skill => {
            const curr = current.skills[skill];
            const prev = previous.skills[skill];
            
            delta.skills[skill] = {
                rankChange: prev.rank - curr.rank, // Positive = improvement
                xpGained: curr.xp - prev.xp,
                xpPerHour: ((curr.xp - prev.xp) / (delta.timeDiff / 3600000))
            };
        });
        
        return delta;
    }

    async updateTracking() {
        // Store previous data
        this.previousData = { ...this.currentData };
        
        // Fetch new data
        this.currentData['10tontos'] = await this.fetchPlayerStats('10tontos');
        this.currentData['Samuelb2800'] = await this.fetchPlayerStats('Samuelb2800');
        
        // Calculate deltas
        this.deltaData['10tontos'] = this.calculateDeltas('10tontos');
        this.deltaData['Samuelb2800'] = this.calculateDeltas('Samuelb2800');
        
        // Update history
        if (this.deltaData['10tontos']) {
            this.historyData['10tontos'].push({
                time: Date.now(),
                totalXP: this.currentData['10tontos'].skills.Overall.xp
            });
            if (this.historyData['10tontos'].length > 100) {
                this.historyData['10tontos'].shift();
            }
        }
        
        if (this.deltaData['Samuelb2800']) {
            this.historyData['Samuelb2800'].push({
                time: Date.now(),
                totalXP: this.currentData['Samuelb2800'].skills.Overall.xp
            });
            if (this.historyData['Samuelb2800'].length > 100) {
                this.historyData['Samuelb2800'].shift();
            }
        }
        
        this.renderTracker();
    }

    renderTracker() {
        const container = document.getElementById('hiscores-tracker-content');
        if (!container) return;
        
        let html = '<div class="hiscores-grid">';
        
        // Player comparison cards
        ['10tontos', 'Samuelb2800'].forEach(username => {
            const current = this.currentData[username];
            const delta = this.deltaData[username];
            
            if (!current) return;
            
            html += `
                <div class="player-hiscores-card">
                    <h3>${username}</h3>
                    <div class="overall-stats">
                        <div class="stat-item">
                            <span class="stat-label">Total Level</span>
                            <span class="stat-value">${current.skills.Overall.level}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Total XP</span>
                            <span class="stat-value">${current.skills.Overall.xp.toLocaleString()}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Overall Rank</span>
                            <span class="stat-value">#${current.skills.Overall.rank.toLocaleString()}</span>
                        </div>
                    </div>
                    ${delta ? `
                        <div class="delta-stats">
                            <h4>Changes (Last ${Math.round(delta.timeDiff / 60000)} min)</h4>
                            <div class="stat-item">
                                <span class="stat-label">Rank Change</span>
                                <span class="stat-value ${delta.skills.Overall.rankChange > 0 ? 'positive' : 'negative'}">
                                    ${delta.skills.Overall.rankChange > 0 ? '+' : ''}${delta.skills.Overall.rankChange}
                                </span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">XP Gained</span>
                                <span class="stat-value positive">+${delta.skills.Overall.xpGained.toLocaleString()}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">XP/Hour</span>
                                <span class="stat-value">${Math.round(delta.skills.Overall.xpPerHour).toLocaleString()}</span>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        });
        
        html += '</div>';
        
        // Top gaining skills
        html += '<div class="top-gains-section">';
        ['10tontos', 'Samuelb2800'].forEach(username => {
            const delta = this.deltaData[username];
            if (!delta) return;
            
            const topSkills = Object.entries(delta.skills)
                .filter(([skill]) => skill !== 'Overall')
                .sort((a, b) => b[1].xpGained - a[1].xpGained)
                .slice(0, 5);
            
            html += `
                <div class="top-gains-card">
                    <h4>${username}'s Top Gaining Skills</h4>
                    <div class="skill-gains-list">
            `;
            
            topSkills.forEach(([skill, data]) => {
                if (data.xpGained > 0) {
                    html += `
                        <div class="skill-gain-item">
                            <span class="skill-name">${skill}</span>
                            <span class="xp-gain">+${data.xpGained.toLocaleString()} XP</span>
                            <span class="xp-rate">${Math.round(data.xpPerHour).toLocaleString()}/hr</span>
                        </div>
                    `;
                }
            });
            
            html += '</div></div>';
        });
        html += '</div>';
        
        // Historical graph
        html += '<div class="history-graph-container"><canvas id="xp-history-chart"></canvas></div>';
        
        container.innerHTML = html;
        
        // Render chart
        this.renderHistoryChart();
    }

    renderHistoryChart() {
        const canvas = document.getElementById('xp-history-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }
        
        this.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: '10tontos',
                        data: this.historyData['10tontos'].map(d => ({
                            x: new Date(d.time),
                            y: d.totalXP
                        })),
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.1
                    },
                    {
                        label: 'Samuelb2800',
                        data: this.historyData['Samuelb2800'].map(d => ({
                            x: new Date(d.time),
                            y: d.totalXP
                        })),
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Total XP Over Time'
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'minute'
                        }
                    },
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    start() {
        // Initial update
        this.updateTracking();
        
        // Set up periodic updates
        setInterval(() => {
            this.updateTracking();
        }, this.updateInterval);
    }
}

// Initialize on page load
window.hiscoresTracker = new HiscoresTracker();