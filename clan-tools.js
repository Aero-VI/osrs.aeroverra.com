// Clan Tools Dashboard
class ClanTools {
    constructor() {
        this.bingoCards = {
            current: {
                name: 'Winter Bingo 2024',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-02-01'),
                tiles: [
                    { id: 1, task: 'Get any Zenyte', completed: false, completedBy: null },
                    { id: 2, task: 'Complete Inferno', completed: true, completedBy: 'Samuelb2800' },
                    { id: 3, task: 'Get Bandos Chestplate', completed: true, completedBy: '10tontos' },
                    { id: 4, task: 'Max a skill', completed: false, completedBy: null },
                    { id: 5, task: 'Get any Raid unique', completed: true, completedBy: 'Samuelb2800' },
                    { id: 6, task: '50M total XP', completed: true, completedBy: '10tontos' },
                    { id: 7, task: 'Complete 100 Vorkath', completed: true, completedBy: '10tontos' },
                    { id: 8, task: 'Get any Cerberus crystal', completed: false, completedBy: null },
                    { id: 9, task: 'Complete a Master clue', completed: true, completedBy: 'Samuelb2800' },
                    { id: 10, task: 'Get 85 Slayer', completed: true, completedBy: '10tontos' },
                    { id: 11, task: 'Get any GWD hilt', completed: false, completedBy: null },
                    { id: 12, task: 'Complete DS2', completed: true, completedBy: 'Both' },
                    { id: 13, task: 'Get Fire Cape', completed: true, completedBy: 'Both' },
                    { id: 14, task: 'Get Barrows item', completed: true, completedBy: '10tontos' },
                    { id: 15, task: 'Reach 2k total', completed: false, completedBy: null },
                    { id: 16, task: 'Get any DKS ring', completed: true, completedBy: 'Samuelb2800' },
                    { id: 17, task: 'Complete ToB', completed: true, completedBy: 'Samuelb2800' },
                    { id: 18, task: 'Get Dragon Pickaxe', completed: false, completedBy: null },
                    { id: 19, task: 'Get 90+ in any skill', completed: true, completedBy: 'Both' },
                    { id: 20, task: 'Complete CoX', completed: true, completedBy: 'Both' },
                    { id: 21, task: 'Get any Spirit Shield', completed: true, completedBy: '10tontos' },
                    { id: 22, task: 'Get Quest Cape', completed: false, completedBy: null },
                    { id: 23, task: 'Get any Wilderness boss unique', completed: false, completedBy: null },
                    { id: 24, task: 'Get 99 in any skill', completed: true, completedBy: '10tontos' },
                    { id: 25, task: 'Get Abyssal Whip', completed: true, completedBy: 'Both' }
                ],
                participants: ['10tontos', 'Samuelb2800']
            }
        };
        
        this.competitions = [
            {
                name: 'Monthly XP Competition',
                type: 'xp',
                skill: 'Overall',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-01-31'),
                participants: [
                    { name: '10tontos', startXP: 150000000, currentXP: 165000000 },
                    { name: 'Samuelb2800', startXP: 140000000, currentXP: 158000000 },
                    { name: 'ClanMate1', startXP: 120000000, currentXP: 132000000 },
                    { name: 'ClanMate2', startXP: 180000000, currentXP: 195000000 },
                    { name: 'ClanMate3', startXP: 90000000, currentXP: 98000000 }
                ]
            },
            {
                name: 'Boss of the Week - Vorkath',
                type: 'boss',
                boss: 'Vorkath',
                startDate: new Date('2024-01-15'),
                endDate: new Date('2024-01-22'),
                participants: [
                    { name: '10tontos', kills: 245 },
                    { name: 'Samuelb2800', kills: 189 },
                    { name: 'ClanMate1', kills: 156 },
                    { name: 'ClanMate2', kills: 312 }
                ]
            }
        ];
        
        this.raidSplits = [];
    }

    renderBingoCard() {
        const bingo = this.bingoCards.current;
        const grid = [];
        
        // Create 5x5 grid
        for (let i = 0; i < 5; i++) {
            grid[i] = [];
            for (let j = 0; j < 5; j++) {
                grid[i][j] = bingo.tiles[i * 5 + j];
            }
        }
        
        // Check for winning lines
        const winningLines = this.checkBingoWins(grid);
        
        let html = `
            <div class="bingo-container">
                <h3>${bingo.name}</h3>
                <p class="bingo-date">Ends: ${bingo.endDate.toLocaleDateString()}</p>
                
                <div class="bingo-grid">
        `;
        
        grid.forEach((row, rowIndex) => {
            row.forEach((tile, colIndex) => {
                const isWinningTile = this.isTileInWinningLine(rowIndex, colIndex, winningLines);
                html += `
                    <div class="bingo-tile ${tile.completed ? 'completed' : ''} ${isWinningTile ? 'winning' : ''}">
                        <p class="bingo-task">${tile.task}</p>
                        ${tile.completed ? `<p class="completed-by">${tile.completedBy}</p>` : ''}
                    </div>
                `;
            });
        });
        
        html += `
                </div>
                
                <div class="bingo-stats">
                    <h4>Progress</h4>
                    <p>Completed: ${bingo.tiles.filter(t => t.completed).length}/25</p>
                    <p>Bingos: ${winningLines.length}</p>
                    
                    <div class="participant-scores">
                        ${bingo.participants.map(p => {
                            const completed = bingo.tiles.filter(t => t.completedBy === p || t.completedBy === 'Both').length;
                            return `<p>${p}: ${completed} tiles</p>`;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
        
        return html;
    }

    checkBingoWins(grid) {
        const lines = [];
        
        // Check rows
        for (let i = 0; i < 5; i++) {
            if (grid[i].every(tile => tile.completed)) {
                lines.push({ type: 'row', index: i });
            }
        }
        
        // Check columns
        for (let j = 0; j < 5; j++) {
            if (grid.every(row => row[j].completed)) {
                lines.push({ type: 'col', index: j });
            }
        }
        
        // Check diagonals
        if (grid.every((row, i) => row[i].completed)) {
            lines.push({ type: 'diag', index: 0 });
        }
        if (grid.every((row, i) => row[4 - i].completed)) {
            lines.push({ type: 'diag', index: 1 });
        }
        
        return lines;
    }

    isTileInWinningLine(row, col, winningLines) {
        return winningLines.some(line => {
            if (line.type === 'row' && line.index === row) return true;
            if (line.type === 'col' && line.index === col) return true;
            if (line.type === 'diag' && line.index === 0 && row === col) return true;
            if (line.type === 'diag' && line.index === 1 && row === 4 - col) return true;
            return false;
        });
    }

    renderRaidSplitCalculator() {
        let html = `
            <div class="raid-split-calculator">
                <h3>Raid Split Calculator</h3>
                
                <div class="split-inputs">
                    <div class="input-group">
                        <label>Raid Type</label>
                        <select id="raid-type">
                            <option value="cox">Chambers of Xeric</option>
                            <option value="tob">Theatre of Blood</option>
                            <option value="toa">Tombs of Amascut</option>
                        </select>
                    </div>
                    
                    <div class="input-group">
                        <label>Team Size</label>
                        <input type="number" id="team-size" value="4" min="1" max="8">
                    </div>
                    
                    <div class="input-group">
                        <label>Total Loot Value</label>
                        <input type="number" id="loot-value" placeholder="Enter total loot value">
                    </div>
                    
                    <div class="participants-list">
                        <h4>Participants</h4>
                        <div id="participant-inputs">
                            <input type="text" class="participant-name" placeholder="Player 1" value="10tontos">
                            <input type="text" class="participant-name" placeholder="Player 2" value="Samuelb2800">
                            <input type="text" class="participant-name" placeholder="Player 3">
                            <input type="text" class="participant-name" placeholder="Player 4">
                        </div>
                    </div>
                    
                    <button class="calculate-split-btn" onclick="window.clanTools.calculateSplit()">
                        Calculate Split
                    </button>
                </div>
                
                <div id="split-results"></div>
                
                <div class="split-history">
                    <h4>Recent Splits</h4>
                    <div id="split-history-list"></div>
                </div>
            </div>
        `;
        
        return html;
    }

    calculateSplit() {
        const raidType = document.getElementById('raid-type').value;
        const teamSize = parseInt(document.getElementById('team-size').value);
        const lootValue = parseInt(document.getElementById('loot-value').value) || 0;
        
        const participants = Array.from(document.querySelectorAll('.participant-name'))
            .slice(0, teamSize)
            .map(input => input.value)
            .filter(name => name);
        
        if (participants.length !== teamSize) {
            alert('Please enter all participant names');
            return;
        }
        
        const splitAmount = Math.floor(lootValue / teamSize);
        const remainder = lootValue % teamSize;
        
        const split = {
            date: new Date(),
            raid: raidType,
            totalLoot: lootValue,
            participants: participants,
            splitAmount: splitAmount,
            remainder: remainder
        };
        
        this.raidSplits.push(split);
        this.displaySplitResults(split);
        this.updateSplitHistory();
    }

    displaySplitResults(split) {
        const container = document.getElementById('split-results');
        
        let html = `
            <div class="split-result">
                <h4>Split Results</h4>
                <p class="total-loot">Total Loot: ${split.totalLoot.toLocaleString()} gp</p>
                <p class="per-person">Each Person: ${split.splitAmount.toLocaleString()} gp</p>
                ${split.remainder > 0 ? `<p class="remainder">Remainder: ${split.remainder} gp (to MVP/organizer)</p>` : ''}
                
                <div class="split-breakdown">
                    ${split.participants.map(p => `
                        <div class="split-player">
                            <span>${p}</span>
                            <span>${split.splitAmount.toLocaleString()} gp</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }

    updateSplitHistory() {
        const container = document.getElementById('split-history-list');
        const recentSplits = this.raidSplits.slice(-5).reverse();
        
        let html = '';
        recentSplits.forEach(split => {
            html += `
                <div class="history-item">
                    <span>${split.raid.toUpperCase()}</span>
                    <span>${split.totalLoot.toLocaleString()} gp</span>
                    <span>${split.participants.length} players</span>
                    <span>${new Date(split.date).toLocaleDateString()}</span>
                </div>
            `;
        });
        
        container.innerHTML = html || '<p>No splits recorded yet</p>';
    }

    renderCompetitionLeaderboard() {
        let html = '<div class="competitions-section">';
        
        this.competitions.forEach(comp => {
            html += `
                <div class="competition-card">
                    <h3>${comp.name}</h3>
                    <p class="comp-date">${comp.startDate.toLocaleDateString()} - ${comp.endDate.toLocaleDateString()}</p>
                    
                    <div class="leaderboard">
            `;
            
            if (comp.type === 'xp') {
                const sorted = [...comp.participants].sort((a, b) => 
                    (b.currentXP - b.startXP) - (a.currentXP - a.startXP)
                );
                
                sorted.forEach((participant, index) => {
                    const gained = participant.currentXP - participant.startXP;
                    html += `
                        <div class="leaderboard-entry ${index < 3 ? 'top3' : ''}">
                            <span class="rank">#${index + 1}</span>
                            <span class="player-name">${participant.name}</span>
                            <span class="xp-gained">+${gained.toLocaleString()} XP</span>
                        </div>
                    `;
                });
            } else if (comp.type === 'boss') {
                const sorted = [...comp.participants].sort((a, b) => b.kills - a.kills);
                
                sorted.forEach((participant, index) => {
                    html += `
                        <div class="leaderboard-entry ${index < 3 ? 'top3' : ''}">
                            <span class="rank">#${index + 1}</span>
                            <span class="player-name">${participant.name}</span>
                            <span class="kills">${participant.kills} kills</span>
                        </div>
                    `;
                });
            }
            
            html += `
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    renderTools() {
        const container = document.getElementById('clan-tools-content');
        if (!container) return;
        
        let html = `
            <div class="clan-tools-grid">
                <div class="tool-section">
                    ${this.renderBingoCard()}
                </div>
                
                <div class="tool-section">
                    ${this.renderRaidSplitCalculator()}
                </div>
                
                <div class="tool-section">
                    <h3>Competition Leaderboards</h3>
                    ${this.renderCompetitionLeaderboard()}
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }

    init() {
        this.renderTools();
    }
}

// Initialize clan tools
window.clanTools = new ClanTools();