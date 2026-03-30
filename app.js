// OSRS Stats Tracker App
const CRYSTALMATHLABS_API = 'https://crystalmathlabs.com/tracker/api.php';
const OSRS_HISCORES_API = 'https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws';

// Skill data
const SKILLS = [
    'Overall', 'Attack', 'Defence', 'Strength', 'Hitpoints', 'Ranged', 
    'Prayer', 'Magic', 'Cooking', 'Woodcutting', 'Fletching', 'Fishing', 
    'Firemaking', 'Crafting', 'Smithing', 'Mining', 'Herblore', 'Agility', 
    'Thieving', 'Slayer', 'Farming', 'Runecraft', 'Hunter', 'Construction'
];

// Tab switching
document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show target content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(targetTab).classList.add('active');
    });
});

// Load stats on page load
window.addEventListener('DOMContentLoaded', () => {
    loadPlayerStats('Samuelb2800', 'player1-stats');
    loadPlayerStats('10tontos', 'player2-stats');
    loadXPGains();
    loadCorpProgress();
});

// Fetch player stats from Hiscores
async function loadPlayerStats(username, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<div class="loading">Loading stats...</div>';
    
    try {
        // TODO: Replace with deployed worker URL after following DEPLOYMENT.md
        // For now using allorigins.win (slow/unreliable)
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(OSRS_HISCORES_API + '?player=' + username)}`;
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
            throw new Error(`Player "${username}" not found`);
        }
        
        const data = await response.text();
        
        // Check if we actually got hiscores data (should start with numbers)
        if (!data.trim().match(/^-?\d+,\d+,\d+/)) {
            throw new Error('Invalid response from hiscores API');
        }
        
        const stats = parseHiscores(data);
        displayStats(stats, container, username);
    } catch (error) {
        console.error('Error loading stats:', error);
        container.innerHTML = `
            <div class="error-message">
                <h3>${username}</h3>
                <p>⚠️ Failed to load stats</p>
                <p style="font-size: 0.9em; color: #888;">${error.message}</p>
            </div>
        `;
    }
}

// Parse hiscores data
function parseHiscores(data) {
    const lines = data.trim().split('\n');
    const stats = {};
    
    lines.forEach((line, index) => {
        if (index < SKILLS.length) {
            const [rank, level, xp] = line.split(',');
            stats[SKILLS[index]] = {
                rank: parseInt(rank),
                level: parseInt(level),
                xp: parseInt(xp)
            };
        }
    });
    
    return stats;
}

// Display stats in UI
function displayStats(stats, container, username) {
    let html = `<h3 class="player-name">${username}</h3>`;
    
    for (const skill of SKILLS) {
        if (stats[skill] && skill !== 'Overall') {
            html += `
                <div class="skill-row">
                    <span class="skill-name">${skill}</span>
                    <span class="skill-level">${stats[skill].level}</span>
                </div>
            `;
        }
    }
    
    container.innerHTML = html;
}



// Load XP gains
async function loadXPGains() {
    const container = document.getElementById('gains-content');
    
    // Mock XP gains data
    const gains = [
        { skill: 'Slayer', xp: 125000, rank: 1 },
        { skill: 'Combat', xp: 98000, rank: 2 },
        { skill: 'Prayer', xp: 75000, rank: 3 },
        { skill: 'Herblore', xp: 65000, rank: 4 },
        { skill: 'Construction', xp: 45000, rank: 5 }
    ];
    
    let html = '<div class="gains-list">';
    gains.forEach(gain => {
        html += `
            <div class="gain-row">
                <span class="gain-rank">#${gain.rank}</span>
                <span class="gain-skill">${gain.skill}</span>
                <span class="gain-xp">+${gain.xp.toLocaleString()} XP</span>
            </div>
        `;
    });
    html += '</div>';
    
    container.innerHTML = html;
}

// Calculate money making methods
function calculateMoneyMaking() {
    const combatLevel = document.getElementById('combat-level').value || 126;
    const slayerLevel = document.getElementById('slayer-level').value || 99;
    const bankValue = document.getElementById('bank-value').value || 100;
    
    const methods = [
        {
            name: 'Vorkath',
            profit: 3500000,
            requirements: 'DS2, Elite Void',
            risk: 'Low',
            boredom: 3,
            minCombat: 100,
            minBank: 50
        },
        {
            name: 'Theatre of Blood',
            profit: 5000000,
            requirements: 'Max combat, Team',
            risk: 'High',
            boredom: 1,
            minCombat: 120,
            minBank: 200
        },
        {
            name: 'Corrupted Gauntlet',
            profit: 4000000,
            requirements: 'SOTE, High skill',
            risk: 'Medium',
            boredom: 2,
            minCombat: 100,
            minBank: 0
        },
        {
            name: 'Gargoyles',
            profit: 800000,
            requirements: '75 Slayer',
            risk: 'None',
            boredom: 5,
            minCombat: 80,
            minBank: 5,
            minSlayer: 75
        },
        {
            name: 'Corp Beast',
            profit: 2500000,
            requirements: 'Team, BGS/DWH',
            risk: 'Medium',
            boredom: 2,
            minCombat: 110,
            minBank: 100
        }
    ];
    
    // Filter and sort methods
    const viableMethods = methods.filter(method => {
        if (combatLevel < method.minCombat) return false;
        if (bankValue < method.minBank) return false;
        if (method.minSlayer && slayerLevel < method.minSlayer) return false;
        return true;
    }).sort((a, b) => b.profit - a.profit);
    
    displayMoneyMethods(viableMethods);
}

// Display money making methods
function displayMoneyMethods(methods) {
    const container = document.getElementById('money-methods');
    
    if (methods.length === 0) {
        container.innerHTML = '<p>No methods match your current stats. Train up!</p>';
        return;
    }
    
    let html = '';
    methods.forEach((method, index) => {
        html += `
            <div class="method-card">
                <div class="method-rank">#${index + 1}</div>
                <div class="method-info">
                    <h4>${method.name}</h4>
                    <p>${method.requirements}</p>
                    <div class="method-stats">
                        <div class="method-stat">
                            <span>GP/Hour</span>
                            <span>${(method.profit / 1000000).toFixed(1)}M</span>
                        </div>
                        <div class="method-stat">
                            <span>Risk</span>
                            <span>${method.risk}</span>
                        </div>
                        <div class="method-stat">
                            <span>Boredom</span>
                            <span>${'⭐'.repeat(method.boredom)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Optimize gear
function optimizeGear() {
    const budget = parseInt(document.getElementById('budget').value) || 50000000;
    const container = document.getElementById('gear-recommendations');
    
    const gearSets = [
        {
            name: 'Budget Vorkath',
            cost: 30000000,
            items: ['Blessed D\'hide', 'Blowpipe', 'BGS', 'Salve (ei)'],
            dps: 'Good'
        },
        {
            name: 'Elite Void Range',
            cost: 80000000,
            items: ['Elite Void', 'DHCB', 'Dragonfire Ward', 'Pegasians'],
            dps: 'Excellent'
        },
        {
            name: 'Max Melee',
            cost: 500000000,
            items: ['Torva', 'Scythe', 'Avernic', 'Infernal Cape'],
            dps: 'Best in Slot'
        },
        {
            name: 'Zulrah Setup',
            cost: 150000000,
            items: ['Ancestral', 'Toxic Trident', 'Suffering (ri)', 'Eternal Boots'],
            dps: 'Very Good'
        }
    ];
    
    const affordableSets = gearSets.filter(set => set.cost <= budget);
    
    let html = '<h3>Recommended Gear Sets</h3>';
    affordableSets.forEach(set => {
        html += `
            <div class="gear-set">
                <h4>${set.name} - ${(set.cost / 1000000).toFixed(0)}M GP</h4>
                <p>Items: ${set.items.join(', ')}</p>
                <p>DPS Rating: ${set.dps}</p>
            </div>
        `;
    });
    
    if (affordableSets.length === 0) {
        html = '<p>No complete gear sets available within budget. Keep grinding!</p>';
    }
    
    container.innerHTML = html;
}

// Check quest progress
function checkQuestProgress() {
    const username = document.getElementById('quest-username').value || 'Samuelb2800';
    const container = document.getElementById('quest-progress');
    
    // Mock quest data
    const quests = [
        { name: 'Dragon Slayer II', status: 'Completed', reward: 'Vorkath access' },
        { name: 'Song of the Elves', status: 'In Progress', reward: 'Gauntlet access' },
        { name: 'Monkey Madness II', status: 'Completed', reward: 'Demonic Gorillas' },
        { name: 'Desert Treasure', status: 'Completed', reward: 'Ancient Magicks' },
        { name: 'A Night at the Theatre', status: 'Not Started', reward: 'Theatre of Blood' }
    ];
    
    let html = `<h3>Quest Progress for ${username}</h3>`;
    quests.forEach(quest => {
        const statusClass = quest.status === 'Completed' ? 'completed' : 
                          quest.status === 'In Progress' ? 'in-progress' : 'not-started';
        html += `
            <div class="quest-item ${statusClass}">
                <span class="quest-name">${quest.name}</span>
                <span class="quest-status">${quest.status}</span>
                <span class="quest-reward">${quest.reward}</span>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Load Corp progress
function loadCorpProgress() {
    // Mock Corp data
    const totalGP = 1250000000; // 1.25B
    const targetGP = 8000000000; // 8B
    const kills = 3847;
    const elySigils = 2;
    const avgGPH = 2500000;
    
    // Update progress bar
    const progressPercent = (totalGP / targetGP) * 100;
    document.getElementById('corp-progress-fill').style.width = progressPercent + '%';
    document.getElementById('corp-progress-text').textContent = 
        `${(totalGP / 1000000).toFixed(0)} / ${(targetGP / 1000000).toFixed(0)}M GP`;
    
    // Update stats
    document.getElementById('corp-kills').textContent = kills.toLocaleString();
    document.getElementById('ely-count').textContent = elySigils;
    document.getElementById('corp-gph').textContent = (avgGPH / 1000000).toFixed(1) + 'M';
    
    // Recent drops log
    const recentDrops = [
        { item: 'Elysian Sigil', value: 650000000, date: 'Today' },
        { item: 'Arcane Sigil', value: 125000000, date: 'Yesterday' },
        { item: 'Holy Elixir', value: 800000, date: '3 days ago' },
        { item: 'Spirit Shield', value: 75000, date: '3 days ago' }
    ];
    
    let logHtml = '<h3>Recent Drops</h3>';
    recentDrops.forEach(drop => {
        logHtml += `
            <div class="drop-item">
                <span class="drop-name">${drop.item}</span>
                <span class="drop-value">${(drop.value / 1000000).toFixed(1)}M GP</span>
                <span class="drop-date">${drop.date}</span>
            </div>
        `;
    });
    
    document.getElementById('corp-log').innerHTML = logHtml;
}

// Add some additional CSS for new elements
const additionalStyles = `
<style>
.gains-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.gain-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background-color: var(--osrs-bg-dark);
    border: 1px solid var(--osrs-border);
    border-radius: 5px;
}

.gain-rank {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--osrs-gold);
}

.gain-xp {
    color: var(--success);
    font-weight: 600;
}

.gear-set {
    background-color: var(--osrs-bg-dark);
    border: 2px solid var(--osrs-border);
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 15px;
}

.gear-set h4 {
    color: var(--osrs-gold);
    margin-bottom: 10px;
}

.quest-item {
    display: grid;
    grid-template-columns: 2fr 1fr 2fr;
    gap: 20px;
    padding: 15px;
    margin-bottom: 10px;
    background-color: var(--osrs-bg-dark);
    border: 1px solid var(--osrs-border);
    border-radius: 5px;
}

.quest-item.completed {
    border-color: var(--success);
}

.quest-item.in-progress {
    border-color: var(--osrs-gold);
}

.quest-status {
    text-align: center;
    font-weight: 600;
}

.drop-item {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 20px;
    padding: 10px;
    border-bottom: 1px solid var(--osrs-border);
}

.drop-name {
    color: var(--osrs-gold);
    font-weight: 500;
}

.drop-value {
    text-align: right;
    color: var(--success);
    font-weight: 600;
}

.drop-date {
    text-align: right;
    color: var(--text-secondary);
    font-size: 0.9rem;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);